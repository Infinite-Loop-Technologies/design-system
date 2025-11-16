// src/app/hooks/useKeymap.ts
import { useInput } from 'ink';
import { useCliState } from './useCliState';

export const useKeymap = () => {
    const { state, dispatch } = useCliState();

    useInput((input, key) => {
        // Global
        if (input === 'q' || (key.ctrl && input === 'c')) {
            // Let Ink handle exit via throwing or process.exit
            // eslint-disable-next-line no-process-exit
            process.exit(0);
        }

        if (input === 'z') {
            dispatch({
                type: 'SET_STATUS',
                status: 'Shortcuts: a=init, s=registry, d=doctor, q=quit, arrows/JK=move, enter=select',
            });
            return;
        }

        if (input === 'a') {
            dispatch({ type: 'SET_MODE', mode: 'init' });
            dispatch({ type: 'SET_STATUS', status: 'Init project wizard' });
            return;
        }

        if (input === 's') {
            dispatch({ type: 'SET_MODE', mode: 'registry' });
            dispatch({ type: 'SET_STATUS', status: 'Browsing registry' });
            return;
        }

        if (input === 'd') {
            // later: run doctor checks
            dispatch({ type: 'SET_STATUS', status: 'Running checks (todo)…' });
            return;
        }

        // Mode-specific keys can be handled by individual screens (via their own useInput),
        // or routed here based on state.mode.
    });
};
