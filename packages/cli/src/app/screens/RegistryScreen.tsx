// src/app/screens/RegistryScreen.tsx
import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useShadcnRegistry } from '../hooks/useLoopRegistry';

export const RegistryScreen: React.FC = () => {
    const { registries, loading, error } = useShadcnRegistry();
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useInput((_input, key) => {
        if (!registries?.length) return;

        if (key.upArrow || _input === 'k') {
            setSelectedIndex((i) => (i > 0 ? i - 1 : registries.length - 1));
        } else if (key.downArrow || _input === 'j') {
            setSelectedIndex((i) => (i + 1) % registries.length);
        } else if (key.return || _input === ' ') {
            const entry = registries[selectedIndex];
            // TODO: open entry, list components, or apply to current project
            // For now just log
            // eslint-disable-next-line no-console
            console.log(`Selected registry: ${entry.name}`);
        }
    });

    if (loading) {
        return (
            <Box padding={1}>
                <Text>Loading registries…</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box padding={1}>
                <Text color='red'>
                    Error loading registries: {error.message}
                </Text>
            </Box>
        );
    }

    if (!registries || registries.length === 0) {
        return (
            <Box padding={1}>
                <Text>No registries configured.</Text>
            </Box>
        );
    }

    return (
        <Box flexDirection='column' padding={1}>
            <Text color='green'>Registries</Text>
            <Box flexDirection='column' marginTop={1}>
                {registries.map((entry, idx) => (
                    <Text
                        key={entry.name}
                        inverse={idx === selectedIndex}
                        color={idx === selectedIndex ? 'black' : 'white'}>
                        {idx === selectedIndex ? '› ' : '  '}
                        {entry.name}
                    </Text>
                ))}
            </Box>
        </Box>
    );
};
