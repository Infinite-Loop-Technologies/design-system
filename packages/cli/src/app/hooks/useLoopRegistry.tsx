// packages/loop-tui/src/app/hooks/useLoopRegistry.ts
import React from 'react';
import { searchRegistryItems } from '@loop-kit/registry';

export const useLoopRegistry = () => {
    const [state, setState] = React.useState({
        loading: true,
        error: null as null | Error,
        items: [] as { name: string; registry: string }[],
    });

    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { items } = await searchRegistryItems(['ui.shadcn.com']);
                if (!cancelled)
                    setState({ loading: false, error: null, items });
            } catch (err) {
                if (!cancelled)
                    setState({
                        loading: false,
                        error: err as Error,
                        items: [],
                    });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return state;
};
