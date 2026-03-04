export type LoopdState = {
    pid: number;
    port: number;
    startedAt: string;
};
export declare function loopdStatus(workspaceRoot: string): Promise<{
    running: boolean;
    state?: LoopdState;
}>;
export declare function loopdStart(workspaceRoot: string, options?: {
    port?: number;
}): Promise<{
    running: boolean;
    state: LoopdState;
}>;
export declare function loopdStop(workspaceRoot: string): Promise<{
    stopped: boolean;
    state?: LoopdState;
}>;
//# sourceMappingURL=control.d.ts.map