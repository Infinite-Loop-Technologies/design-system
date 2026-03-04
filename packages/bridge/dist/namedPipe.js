import net from 'node:net';
import crypto from 'node:crypto';
import { decodeEnvelope, encodeEnvelope } from './envelope.js';
export function namedPipePath(pipeName = 'loop-kit-host-shell') {
    if (process.platform === 'win32') {
        return `\\\\.\\pipe\\${pipeName}`;
    }
    return `/tmp/${pipeName}.sock`;
}
export async function invokeNamedPipeRpc(pipePath, method, params = {}, timeoutMs = 5_000) {
    const request = {
        version: '1',
        type: 'invoke',
        id: crypto.randomUUID(),
        method,
        params,
    };
    return new Promise((resolve, reject) => {
        const socket = net.createConnection(pipePath);
        const timer = setTimeout(() => {
            socket.destroy();
            reject(new Error(`RPC timeout after ${timeoutMs}ms`));
        }, timeoutMs);
        let buffer = '';
        socket.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        socket.on('connect', () => {
            socket.write(encodeEnvelope(request));
        });
        socket.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
            const newlineIndex = buffer.indexOf('\n');
            if (newlineIndex === -1) {
                return;
            }
            const line = buffer.slice(0, newlineIndex).trim();
            if (!line) {
                return;
            }
            try {
                const envelope = decodeEnvelope(line);
                if (envelope.type !== 'result' || envelope.id !== request.id) {
                    return;
                }
                clearTimeout(timer);
                socket.end();
                resolve(envelope);
            }
            catch (parseError) {
                clearTimeout(timer);
                socket.destroy();
                reject(parseError);
            }
        });
    });
}
//# sourceMappingURL=namedPipe.js.map