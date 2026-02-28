import path from 'node:path';
import {
    err,
    parseLoopRef,
    type Result,
} from '@loop-kit/loop-contracts';
import type { ProviderHost } from '../providers/host.js';
import type { ResolveComponentResult } from '../types.js';

export async function resolveComponentRef(
    workspaceRoot: string,
    host: ProviderHost,
    refText: string,
): Promise<Result<ResolveComponentResult>> {
    const parsed = parseLoopRef(refText);
    if (!parsed.ok) {
        return parsed;
    }

    const ref = parsed.value;
    let laneId = 'local';
    if (ref.kind === 'file') {
        laneId = 'file';
    } else if (ref.kind === 'git') {
        laneId = 'git';
    } else if (ref.kind === 'http') {
        laneId = 'http';
    } else if (ref.kind === 'loop') {
        laneId = 'local';
    }

    const lane = host.getLaneProvider(laneId);
    if (!lane) {
        return err({
            code: 'lane.not_found',
            message: `Lane provider not found: ${laneId}`,
        });
    }

    const normalizedRef =
        ref.kind === 'loop'
            ? { kind: 'local' as const, id: `${ref.namespace}/${ref.name}` }
            : ref;

    const resolved = await lane.resolveComponent({
        laneId,
        workspaceRoot,
        ref: normalizedRef,
    });

    if (!resolved.ok) {
        return resolved;
    }

    return {
        ok: true,
        value: {
            manifest: resolved.value.manifest,
            baseDir: path.resolve(resolved.value.baseDir),
            snapshotId: resolved.value.snapshotId,
            laneId,
        },
    };
}
