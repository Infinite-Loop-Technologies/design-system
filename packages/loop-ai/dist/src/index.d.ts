export type AiDoctorPlan = {
    workspaceRoot: string;
    diagnostics: Array<{
        id: string;
        severity: string;
        message: string;
    }>;
    safeFixIds: string[];
    applied: boolean;
    executionCount: number;
};
export declare function runAiDoctor(workspaceRoot: string, options?: {
    apply?: boolean;
}): Promise<AiDoctorPlan>;
//# sourceMappingURL=index.d.ts.map