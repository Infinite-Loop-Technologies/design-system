import { z } from 'zod';

const REF_KINDS = ['local', 'file', 'git', 'http', 'loop', 'npm'] as const;

export const WorkspaceSettingsSchema = z.object({
    name: z.string().min(1).default('loop-workspace'),
    appsDir: z.string().default('apps'),
    packagesDir: z.string().default('packages'),
    assetsDir: z.string().default('assets'),
    toolsDir: z.string().default('tools'),
    loopDir: z.string().default('loop'),
});

export const LaneConfigSchema = z.object({
    id: z.string().min(1),
    kind: z.string().min(1),
    config: z.record(z.string(), z.unknown()).default({}),
});

export const LegacyLaneConfigSchema = z.object({
    id: z.string().min(1),
    kind: z.string().min(1),
    options: z.record(z.string(), z.unknown()).default({}),
});

export const LaneInstanceSchema = z.object({
    kind: z.string().min(1),
    config: z.record(z.string(), z.unknown()).default({}),
});

export const LoopDefaultsSchema = z.object({
    componentLane: z.string().min(1).optional(),
    moduleLane: z.string().min(1).optional(),
    refKindMap: z.record(z.string(), z.string().min(1)).optional(),
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

const LaneMapSchema = z.record(z.string().min(1), LaneInstanceSchema);

const LoopWorkspaceInputSchema = z.object({
    schemaVersion: z.literal('1'),
    workspace: WorkspaceSettingsSchema.default({
        name: 'loop-workspace',
        appsDir: 'apps',
        packagesDir: 'packages',
        assetsDir: 'assets',
        toolsDir: 'tools',
        loopDir: 'loop',
    }),
    lanes: z.union([LaneMapSchema, z.array(LegacyLaneConfigSchema), z.array(LaneConfigSchema)]).optional(),
    defaults: LoopDefaultsSchema.optional(),
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

function defaultLaneMap(): Record<string, z.infer<typeof LaneInstanceSchema>> {
    return {
        local: {
            kind: 'local',
            config: {},
        },
        file: {
            kind: 'file',
            config: {},
        },
    };
}

function normalizeLanes(
    raw: z.infer<typeof LoopWorkspaceInputSchema>['lanes'],
): Record<string, z.infer<typeof LaneInstanceSchema>> {
    if (!raw) {
        return defaultLaneMap();
    }

    if (Array.isArray(raw)) {
        const mapped: Record<string, z.infer<typeof LaneInstanceSchema>> = {};
        for (const lane of raw) {
            if ('options' in lane) {
                mapped[lane.id] = {
                    kind: lane.kind,
                    config: lane.options,
                };
            } else {
                mapped[lane.id] = {
                    kind: lane.kind,
                    config: lane.config,
                };
            }
        }

        if (Object.keys(mapped).length === 0) {
            return defaultLaneMap();
        }

        return mapped;
    }

    if (Object.keys(raw).length === 0) {
        return defaultLaneMap();
    }

    return raw;
}

function chooseDefaultLaneId(lanes: Record<string, z.infer<typeof LaneInstanceSchema>>): string {
    if (lanes.local) {
        return 'local';
    }

    const first = Object.keys(lanes)[0];
    return first ?? 'local';
}

function normalizeRefKindMap(raw?: Record<string, string>): Record<string, string> {
    if (!raw) {
        return {};
    }

    return { ...raw };
}

const LoopWorkspaceCanonicalSchema = z
    .object({
        schemaVersion: z.literal('1'),
        workspace: WorkspaceSettingsSchema,
        lanes: LaneMapSchema,
        defaults: z.object({
            componentLane: z.string().min(1),
            moduleLane: z.string().min(1),
            refKindMap: z.record(z.string(), z.string().min(1)).default({}),
        }),
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
    })
    .superRefine((value, ctx) => {
        const laneIds = new Set(Object.keys(value.lanes));
        if (!laneIds.has(value.defaults.componentLane)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['defaults', 'componentLane'],
                message: `Unknown lane instance ID: ${value.defaults.componentLane}`,
            });
        }

        if (!laneIds.has(value.defaults.moduleLane)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['defaults', 'moduleLane'],
                message: `Unknown lane instance ID: ${value.defaults.moduleLane}`,
            });
        }

        for (const [refKind, laneId] of Object.entries(value.defaults.refKindMap)) {
            if (!(REF_KINDS as readonly string[]).includes(refKind)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['defaults', 'refKindMap', refKind],
                    message: `Unsupported ref kind in defaults.refKindMap: ${refKind}`,
                });
            }

            if (!laneIds.has(laneId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['defaults', 'refKindMap', refKind],
                    message: `Unknown lane instance ID in defaults.refKindMap: ${laneId}`,
                });
            }
        }
    });

export type LoopWorkspaceInput = z.infer<typeof LoopWorkspaceInputSchema>;

export function normalizeLoopWorkspaceConfig(input: LoopWorkspaceInput): z.infer<typeof LoopWorkspaceCanonicalSchema> {
    const lanes = normalizeLanes(input.lanes);
    const fallbackLaneId = chooseDefaultLaneId(lanes);

    return {
        schemaVersion: input.schemaVersion,
        workspace: input.workspace,
        lanes,
        defaults: {
            componentLane: input.defaults?.componentLane ?? fallbackLaneId,
            moduleLane: input.defaults?.moduleLane ?? fallbackLaneId,
            refKindMap: normalizeRefKindMap(input.defaults?.refKindMap),
        },
        modules: input.modules,
        toolchains: input.toolchains,
        components: input.components,
    };
}

export const LoopWorkspaceConfigSchema = LoopWorkspaceInputSchema
    .transform((input, ctx): z.infer<typeof LoopWorkspaceCanonicalSchema> => {
        const normalized = normalizeLoopWorkspaceConfig(input);
        const validated = LoopWorkspaceCanonicalSchema.safeParse(normalized);
        if (!validated.success) {
            for (const issue of validated.error.issues) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: issue.path,
                    message: issue.message,
                });
            }

            return z.NEVER as z.infer<typeof LoopWorkspaceCanonicalSchema>;
        }

        return validated.data;
    });

export type LaneConfig = z.infer<typeof LaneConfigSchema>;
export type LegacyLaneConfig = z.infer<typeof LegacyLaneConfigSchema>;
export type LaneInstance = z.infer<typeof LaneInstanceSchema>;
export type LoopDefaults = z.infer<typeof LoopDefaultsSchema>;
export type WorkspaceSettings = z.infer<typeof WorkspaceSettingsSchema>;
export type EnabledModule = z.infer<typeof EnabledModuleSchema>;
export type ToolchainConfig = z.infer<typeof ToolchainConfigSchema>;
export type LoopWorkspaceConfig = z.infer<typeof LoopWorkspaceConfigSchema>;
