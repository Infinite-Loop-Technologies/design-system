import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
function statePath(workspaceRoot) {
    return path.join(workspaceRoot, 'loop', '.loopd', 'state.json');
}
async function readState(workspaceRoot) {
    try {
        const raw = await fs.readFile(statePath(workspaceRoot), 'utf8');
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
async function writeState(workspaceRoot, state) {
    const filePath = statePath(workspaceRoot);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}
function isPidAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    }
    catch {
        return false;
    }
}
export async function loopdStatus(workspaceRoot) {
    const state = await readState(workspaceRoot);
    if (!state) {
        return { running: false };
    }
    return {
        running: isPidAlive(state.pid),
        state,
    };
}
export async function loopdStart(workspaceRoot, options = {}) {
    const current = await loopdStatus(workspaceRoot);
    if (current.running && current.state) {
        return current;
    }
    const port = options.port ?? 4545;
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const workerPath = path.resolve(currentDir, 'worker.js');
    const child = spawn(process.execPath, [workerPath], {
        cwd: workspaceRoot,
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
        env: {
            ...process.env,
            LOOPD_WORKSPACE_ROOT: workspaceRoot,
            LOOPD_PORT: String(port),
        },
    });
    child.unref();
    const state = {
        pid: child.pid ?? -1,
        port,
        startedAt: new Date().toISOString(),
    };
    await writeState(workspaceRoot, state);
    return {
        running: true,
        state,
    };
}
export async function loopdStop(workspaceRoot) {
    const current = await readState(workspaceRoot);
    if (!current) {
        return { stopped: false };
    }
    try {
        process.kill(current.pid);
    }
    catch {
        // Already gone; proceed with cleanup.
    }
    await fs.rm(statePath(workspaceRoot), { force: true });
    return {
        stopped: true,
        state: current,
    };
}
//# sourceMappingURL=control.js.map