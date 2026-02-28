import path from 'node:path';
import {
    ok,
    type Result,
} from '@loop-kit/loop-contracts';
import { nodeFsGateway, type FsGateway } from '../io/fsGateway.js';
import type { ProviderHost } from '../providers/host.js';
import { executePatchPlan } from '../patch/executor.js';
import { sha256 } from '../utils/hash.js';
import type { AddComponentResult } from '../types.js';
import { buildComponentInstallPlan } from './plan.js';
import {
    readComponentLockfile,
    upsertInstallRecord,
    writeComponentLockfile,
} from './lockfile.js';
import { resolveComponentRef } from './resolve.js';

function normalizeTargetPath(workspaceRoot: string, targetPath: string | undefined): string {
    if (!targetPath || targetPath === '.') {
        return '.';
    }

    if (path.isAbsolute(targetPath)) {
        return path.relative(workspaceRoot, targetPath) || '.';
    }

    return targetPath;
}

export async function addComponent(
    workspaceRoot: string,
    host: ProviderHost,
    refText: string,
    options: {
        targetPath?: string;
        dryRun?: boolean;
        fs?: FsGateway;
    } = {},
): Promise<Result<AddComponentResult>> {
    const fs = options.fs ?? nodeFsGateway;
    const resolved = await resolveComponentRef(workspaceRoot, host, refText);
    if (!resolved.ok) {
        return resolved;
    }

    const targetPath = normalizeTargetPath(workspaceRoot, options.targetPath);
    const plan = await buildComponentInstallPlan(resolved.value.manifest, {
        componentBaseDir: resolved.value.baseDir,
        targetPath,
        overwriteFiles: false,
        fs,
    });

    const execution = await executePatchPlan(plan, {
        workspaceRoot,
        dryRun: options.dryRun,
        fs,
    });

    if (!options.dryRun) {
        const lockfile = await readComponentLockfile(workspaceRoot, fs);
        const managedFiles = [] as Array<{ path: string; sha256: string; mtimeMs: number }>;
        for (const entry of resolved.value.manifest.files) {
            const relativePath = path.normalize(path.join(targetPath, entry.target));
            const absolutePath = path.resolve(workspaceRoot, relativePath);
            if (!(await fs.exists(absolutePath))) {
                continue;
            }

            const content = await fs.readText(absolutePath);
            const stat = await fs.stat(absolutePath);
            managedFiles.push({
                path: relativePath,
                sha256: sha256(content),
                mtimeMs: stat.mtimeMs,
            });
        }

        const nextLockfile = upsertInstallRecord(lockfile, {
            componentId: resolved.value.manifest.id,
            laneId: resolved.value.laneId,
            ref: refText,
            snapshotId: resolved.value.snapshotId,
            targetPath,
            installedAt: new Date().toISOString(),
            ignoreGlobs: [],
            managedFiles,
        });

        await writeComponentLockfile(workspaceRoot, nextLockfile, fs);

        return ok({
            plan,
            execution,
            lockfile: nextLockfile,
        });
    }

    const lockfile = await readComponentLockfile(workspaceRoot, fs);
    return ok({
        plan,
        execution,
        lockfile,
    });
}
