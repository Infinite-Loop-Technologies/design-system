import { createKernel } from '@loop-kit/loop-kernel';

export async function handleLaneList(options: { cwd?: string; json?: boolean }): Promise<void> {
    const kernel = createKernel({ workspaceRoot: options.cwd });
    const result = await kernel.laneList();
    if (!result.ok) {
        throw new Error(result.error.message);
    }

    if (options.json) {
        console.log(JSON.stringify(result.value, null, 2));
        return;
    }

    for (const lane of result.value) {
        console.log(`${lane.lane.id} (${lane.lane.kind}) auth=${lane.authenticated} ${lane.message ?? ''}`.trim());
    }
}

export async function handleLaneAdd(options: {
    cwd?: string;
    id: string;
    kind: string;
    optionsJson?: string;
}): Promise<void> {
    const kernel = createKernel({ workspaceRoot: options.cwd });
    const laneOptions = options.optionsJson ? JSON.parse(options.optionsJson) : {};

    const result = await kernel.laneAdd({
        id: options.id,
        kind: options.kind,
        options: laneOptions,
    });

    if (!result.ok) {
        throw new Error(result.error.message);
    }

    console.log(`Lane ${options.id} saved.`);
}

export async function handleLaneAuth(options: {
    cwd?: string;
    id: string;
    token: string;
}): Promise<void> {
    const kernel = createKernel({ workspaceRoot: options.cwd });
    const result = await kernel.laneAuth(options.id, options.token);
    if (!result.ok) {
        throw new Error(result.error.message);
    }

    console.log(result.value.warning);
    console.log(`stored at ${result.value.path}`);
}
