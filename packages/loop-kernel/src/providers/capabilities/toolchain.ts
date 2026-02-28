import type {
    Result,
    ToolchainDetectRequest,
    ToolchainDetectResponse,
    ToolchainPlanFixRequest,
    ToolchainPlanFixResponse,
    ToolchainRunRequest,
    ToolchainRunResponse,
} from '@loop-kit/loop-contracts';

export interface ToolchainAdapter {
    readonly id: string;
    readonly kind: string;

    detect(request: ToolchainDetectRequest): Promise<Result<ToolchainDetectResponse>>;
    planFix(request: ToolchainPlanFixRequest): Promise<Result<ToolchainPlanFixResponse>>;
    run(request: ToolchainRunRequest): Promise<Result<ToolchainRunResponse>>;
}
