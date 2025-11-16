// src/app/Root.tsx
import React from 'react';
import { Box, Text } from 'ink';
import { CliStateProvider, useCliState } from './hooks/useCliState';
import { HomeScreen } from './screens/HomeScreen';
import { RegistryScreen } from './screens/RegistryScreen';
import { InitProjectScreen } from './screens/InitProjectScreen';
import { useKeymap } from './hooks/useKeyMap';

const Shell: React.FC = () => {
    const { state } = useCliState();
    useKeymap();

    let Screen: React.FC;
    switch (state.mode) {
        case 'registry':
            Screen = RegistryScreen;
            break;
        case 'init':
            Screen = InitProjectScreen;
            break;
        case 'home':
        default:
            Screen = HomeScreen;
    }

    return (
        <Box flexDirection='column' borderStyle='round' borderColor='green'>
            <Box flexGrow={1}>
                <Screen />
            </Box>
            <Box height={1} paddingX={1}>
                <Text color='gray'>
                    {state.status ??
                        'a: init · s: registry · d: doctor · z: help · q: quit'}
                </Text>
            </Box>
        </Box>
    );
};

export const Root: React.FC = () => {
    return (
        <CliStateProvider>
            <Shell />
        </CliStateProvider>
    );
};
