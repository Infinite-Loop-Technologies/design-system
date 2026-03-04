import { type RpcResultEnvelope } from './envelope.js';
export declare function namedPipePath(pipeName?: string): string;
export declare function invokeNamedPipeRpc(pipePath: string, method: string, params?: Record<string, unknown>, timeoutMs?: number): Promise<RpcResultEnvelope>;
//# sourceMappingURL=namedPipe.d.ts.map