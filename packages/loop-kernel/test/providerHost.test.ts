import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import type { LoopWorkspaceConfig } from '@loop-kit/loop-contracts';
import { ProviderHost } from '../src/providers/host.js';

test('provider host returns typed error when module has no register hook', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'loop-kernel-module-host-'));
    try {
        const moduleRoot = path.join(workspaceRoot, 'loop', 'modules', 'bad-module');
        await fs.ensureDir(moduleRoot);
        await fs.writeJson(path.join(moduleRoot, 'loop.module.json'), {
            schemaVersion: '1',
            kind: 'module',
            id: 'bad-module',
            name: 'bad-module',
            version: '0.1.0',
            entry: './index.js',
            provides: [],
            permissions: [],
        }, { spaces: 2 });
        await fs.writeFile(path.join(moduleRoot, 'index.js'), 'export const value = 1;\n', 'utf8');

        const config: LoopWorkspaceConfig = {
            schemaVersion: '1',
            workspace: {
                appsDir: 'apps',
                packagesDir: 'packages',
                assetsDir: 'assets',
                toolsDir: 'tools',
                loopDir: 'loop',
            },
            lanes: [
                { id: 'local', kind: 'local', options: {} },
                { id: 'file', kind: 'file', options: {} },
            ],
            modules: [
                { ref: 'local:bad-module' },
            ],
            toolchains: [
                { id: 'typescript', kind: 'typescript', options: {} },
            ],
            components: {
                defaultTarget: '.',
                ignoreGlobs: [],
            },
        };

        const host = new ProviderHost();
        const result = await host.loadEnabledModules(workspaceRoot, config);
        assert.equal(result.ok, false);
        if (!result.ok) {
            assert.equal(result.error.code, 'module.missing_register_hook');
        }
    } finally {
        await fs.remove(workspaceRoot);
    }
});
