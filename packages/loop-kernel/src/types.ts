import type {
    ComponentLockfile,
    ComponentManifest,
    Diagnostic,
    KernelError,
    LaneConfig,
    LoopWorkspaceConfig,
    OperationResult,
    PatchPlan,
    Result,
} from '@loop-kit/loop-contracts';

export type KernelOptions = {
    workspaceRoot?: string;
};

export type PatchExecutionResult = {
    applied: boolean;
    operationResults: OperationResult[];
    changedFiles: string[];
    diffByFile: Record<string, string>;
    diagnostics: Diagnostic[];
};

export type DoctorReport = {
    diagnostics: Diagnostic[];
    fixPlans: Array<{
        id: string;
        title: string;
        safe: boolean;
        diagnosticIds: string[];
        plan: PatchPlan;
    }>;
};

export type GraphNode = {
    id: string;
    name: string;
    path: string;
    version: string;
    kind: 'app' | 'pkg';
};

export type GraphEdge = {
    from: string;
    to: string;
    dependencyType: 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies';
};

export type WorkspaceGraph = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};

export type AddComponentResult = {
    plan: PatchPlan;
    execution: PatchExecutionResult;
    lockfile: ComponentLockfile;
};

export type UpdateComponentResult = AddComponentResult;
export type DiffComponentResult = AddComponentResult;

export type ExtractResult = {
    componentId: string;
    snapshotId: string;
    plan: PatchPlan;
    execution: PatchExecutionResult;
};

export type LaneStatus = {
    lane: LaneConfig;
    authenticated: boolean;
    message?: string;
};

export type ToolchainStatus = {
    id: string;
    status: 'ok' | 'warning' | 'error';
    diagnostics: Diagnostic[];
    details: Record<string, unknown>;
};

export type LoadedWorkspace = {
    path: string;
    config: LoopWorkspaceConfig;
};

export type ResolveComponentResult = {
    manifest: ComponentManifest;
    baseDir: string;
    snapshotId: string;
    laneId: string;
};

export type KernelCommandResult<T> = Result<T, KernelError>;
