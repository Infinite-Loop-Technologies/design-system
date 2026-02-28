import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
    ModuleManifestSchema,
    err,
    parseLoopRef,
    type LoopWorkspaceConfig,
    type Result,
} from '@loop-kit/loop-contracts';
import { nodeFsGateway } from '../io/fsGateway.js';
import type { LaneProvider } from './capabilities/lane.js';
import type { PatchAdapter } from './capabilities/patchAdapter.js';
import type { ToolchainAdapter } from './capabilities/toolchain.js';

export class ProviderHost {
    private readonly laneProviders = new Map<string, LaneProvider>();
    private readonly patchAdapters = new Map<string, PatchAdapter>();
    private readonly toolchainAdapters = new Map<string, ToolchainAdapter>();

    registerLaneProvider(provider: LaneProvider): void {
        this.laneProviders.set(provider.id, provider);
    }

    registerPatchAdapter(provider: PatchAdapter): void {
        this.patchAdapters.set(provider.id, provider);
    }

    registerToolchainAdapter(provider: ToolchainAdapter): void {
        this.toolchainAdapters.set(provider.id, provider);
    }

    getLaneProvider(id: string): LaneProvider | undefined {
        return this.laneProviders.get(id);
    }

    getPatchAdapter(id: string): PatchAdapter | undefined {
        return this.patchAdapters.get(id);
    }

    getToolchainAdapter(id: string): ToolchainAdapter | undefined {
        return this.toolchainAdapters.get(id);
    }

    listLaneProviders(): LaneProvider[] {
        return Array.from(this.laneProviders.values());
    }

    listToolchainAdapters(): ToolchainAdapter[] {
        return Array.from(this.toolchainAdapters.values());
    }

    async loadEnabledModules(
        workspaceRoot: string,
        config: LoopWorkspaceConfig,
    ): Promise<Result<{ loaded: string[] }>> {
        const loaded: string[] = [];

        for (const moduleEntry of config.modules) {
            const parsed = parseLoopRef(moduleEntry.ref);
            if (!parsed.ok) {
                return parsed;
            }

            const ref = parsed.value;
            let baseDir: string | undefined;

            if (ref.kind === 'file') {
                baseDir = path.isAbsolute(ref.path)
                    ? ref.path
                    : path.resolve(workspaceRoot, ref.path);
            } else if (ref.kind === 'local') {
                baseDir = path.resolve(workspaceRoot, 'loop', 'modules', ref.id);
            } else {
                return err({
                    code: 'module.ref_not_supported',
                    message: `Module ref kind ${ref.kind} is not supported for dynamic module loading yet.`,
                });
            }

            if (!baseDir) {
                return err({
                    code: 'module.base_dir_missing',
                    message: `Failed to resolve module base directory for ${moduleEntry.ref}`,
                });
            }

            const manifestPath = path.join(baseDir, 'loop.module.json');
            let manifestRaw: unknown;
            try {
                const rawText = await nodeFsGateway.readText(manifestPath);
                manifestRaw = JSON.parse(rawText);
            } catch (error) {
                return err({
                    code: 'module.manifest_missing',
                    message: `Failed loading module manifest at ${manifestPath}`,
                    details: { error: String(error) },
                });
            }

            const parsedManifest = ModuleManifestSchema.safeParse(manifestRaw);
            if (!parsedManifest.success) {
                return err({
                    code: 'module.manifest_invalid',
                    message: `Module manifest schema validation failed at ${manifestPath}`,
                    details: {
                        issues: parsedManifest.error.issues,
                    },
                });
            }

            const entryPath = path.resolve(baseDir, parsedManifest.data.entry);
            let imported: Record<string, unknown>;
            try {
                imported = await import(pathToFileURL(entryPath).href);
            } catch (error) {
                return err({
                    code: 'module.import_failed',
                    message: `Failed to import module entry at ${entryPath}`,
                    details: { error: String(error) },
                });
            }

            if (typeof imported.registerProviders === 'function') {
                await (imported.registerProviders as (host: ProviderHost, config: Record<string, unknown>) => Promise<void> | void)(this, moduleEntry.config ?? {});
            } else if (typeof imported.default === 'function') {
                await (imported.default as (host: ProviderHost, config: Record<string, unknown>) => Promise<void> | void)(this, moduleEntry.config ?? {});
            } else {
                return err({
                    code: 'module.missing_register_hook',
                    message: `Module ${parsedManifest.data.id} does not export registerProviders/default.`,
                });
            }

            loaded.push(parsedManifest.data.id);
        }

        return {
            ok: true,
            value: { loaded },
        };
    }
}
