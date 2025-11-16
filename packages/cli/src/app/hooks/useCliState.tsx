// src/app/hooks/useCliState.ts
import React from 'react';

export type CliMode = 'home' | 'registry' | 'init';

export interface CliState {
    mode: CliMode;
    status: string | null;
}

type Action =
    | { type: 'SET_MODE'; mode: CliMode }
    | { type: 'SET_STATUS'; status: string | null };

const CliStateContext = React.createContext<{
    state: CliState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

const initialState: CliState = {
    mode: 'home',
    status: null,
};

function reducer(state: CliState, action: Action): CliState {
    switch (action.type) {
        case 'SET_MODE':
            return { ...state, mode: action.mode };
        case 'SET_STATUS':
            return { ...state, status: action.status };
        default:
            return state;
    }
}

export const CliStateProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <CliStateContext.Provider value={{ state, dispatch }}>
            {children}
        </CliStateContext.Provider>
    );
};

export const useCliState = () => {
    const ctx = React.useContext(CliStateContext);
    if (!ctx)
        throw new Error('useCliState must be used within CliStateProvider');
    return ctx;
};
