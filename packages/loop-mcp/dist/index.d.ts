type McpRequest = {
    id?: string;
    type: string;
    tool?: string;
    arguments?: Record<string, unknown>;
};
type McpResponse = {
    id?: string;
    type: string;
    result?: unknown;
    error?: {
        code: string;
        message: string;
    };
};
export declare function handleMcpRequest(workspaceRoot: string, request: McpRequest): Promise<McpResponse>;
export declare function serveMcpStdIo(workspaceRoot: string): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map