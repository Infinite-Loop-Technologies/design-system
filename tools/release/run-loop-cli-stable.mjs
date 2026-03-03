#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function readPinnedVersion() {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const configPath = path.join(currentDir, 'loop-cli-stable.json');
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.version !== 'string' || parsed.version.length === 0) {
        throw new Error(`Invalid stable CLI config at ${configPath}`);
    }

    return parsed.version;
}

function run(command, args) {
    return spawnSync(command, args, {
        stdio: 'inherit',
        shell: process.platform === 'win32',
    });
}

function main() {
    const version = readPinnedVersion();
    const args = process.argv.slice(2);
    while (args[0] === '--') {
        args.shift();
    }

    const result = run('pnpm', ['dlx', `@loop-kit/loop-cli@${version}`, ...args]);
    process.exit(result.status ?? 1);
}

main();
