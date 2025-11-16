// packages/registry/src/shadcn-adapter.ts
import {
    searchRegistries,
    getRegistry,
    getRegistriesIndex,
    getRegistryItems,
    resolveRegistryItems,
    RegistryError,
    RegistryNotFoundError,
    RegistryMissingEnvironmentVariablesError,
} from 'shadcn/registries';
import type { Config as ShadcnConfig } from 'shadcn/registries'; // from those types

export type RegistryItem = {
    name: string;
    registry: string;
    addCommandArgument: string;
    type?: string;
    description?: string;
};

export type SimpleRegistrySearchOptions = {
    query?: string;
    limit?: number;
    offset?: number;
    config?: Partial<ShadcnConfig>;
    useCache?: boolean;
};

// Thin wrapper that gives you a nice TS type and hides shadcn’s internal shape.
export async function searchRegistryItems(
    registries: string[],
    options: SimpleRegistrySearchOptions = {}
): Promise<{
    items: RegistryItem[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}> {
    const { items, pagination } = await searchRegistries(registries, options);
    return {
        items,
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
    };
}

// Re-export whatever “raw” helpers you want to give to loop-tui or web UIs:
export {
    getRegistry,
    getRegistriesIndex,
    getRegistryItems,
    resolveRegistryItems,
    RegistryError,
    RegistryNotFoundError,
    RegistryMissingEnvironmentVariablesError,
};
