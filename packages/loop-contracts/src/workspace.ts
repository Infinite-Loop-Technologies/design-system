import { z } from 'zod';

export const LaneConfigSchema = z.object({
    id: z.string().min(1),
    kind: z.string().min(1),
    options: z.record(z.string(), z.unknown()).default({}),
});

export const EnabledModuleSchema = z.object({
    ref: z.string().min(1),
    config: z.record(z.string(), z.unknown()).optional(),
});

export const ToolchainConfigSchema = z.object({
    id: z.string().min(1),
    kind: z.string().min(1),
    options: z.record(z.string(), z.unknown()).default({}),
});

export const LoopWorkspaceConfigSchema = z.object({
    schemaVersion: z.literal('1'),
    workspace: z.object({
        appsDir: z.string().default('apps'),
        packagesDir: z.string().default('packages'),
        assetsDir: z.string().default('assets'),
        toolsDir: z.string().default('tools'),
        loopDir: z.string().default('loop'),
    }),
    lanes: z.array(LaneConfigSchema).default([
        {
            id: 'local',
            kind: 'local',
            options: {},
        },
        {
            id: 'file',
            kind: 'file',
            options: {},
        },
    ]),
    modules: z.array(EnabledModuleSchema).default([]),
    toolchains: z.array(ToolchainConfigSchema).default([
        {
            id: 'typescript',
            kind: 'typescript',
            options: {},
        },
    ]),
    components: z
        .object({
            defaultTarget: z.string().default('.'),
            ignoreGlobs: z.array(z.string()).default([]),
        })
        .default({
            defaultTarget: '.',
            ignoreGlobs: [],
        }),
});

export type LaneConfig = z.infer<typeof LaneConfigSchema>;
export type EnabledModule = z.infer<typeof EnabledModuleSchema>;
export type ToolchainConfig = z.infer<typeof ToolchainConfigSchema>;
export type LoopWorkspaceConfig = z.infer<typeof LoopWorkspaceConfigSchema>;
