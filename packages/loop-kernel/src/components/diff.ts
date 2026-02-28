import {
    ok,
    type Result,
} from '@loop-kit/loop-contracts';
import type { ProviderHost } from '../providers/host.js';
import type { DiffComponentResult } from '../types.js';
import { addComponent } from './add.js';

export async function diffComponent(
    workspaceRoot: string,
    host: ProviderHost,
    refText: string,
    options: {
        targetPath?: string;
    } = {},
): Promise<Result<DiffComponentResult>> {
    const result = await addComponent(workspaceRoot, host, refText, {
        targetPath: options.targetPath,
        dryRun: true,
    });

    if (!result.ok) {
        return result;
    }

    return ok(result.value);
}
