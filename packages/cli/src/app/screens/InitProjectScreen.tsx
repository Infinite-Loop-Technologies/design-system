// src/app/screens/InitProjectScreen.tsx
import React from 'react';
import { Box, Text, useInput } from 'ink';

const PRESETS = ['next-basic', 'next-jazz', 'next-ai-lab'] as const;

export const InitProjectScreen: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useInput((input, key) => {
        if (key.upArrow || input === 'k') {
            setSelectedIndex((i) => (i > 0 ? i - 1 : PRESETS.length - 1));
        } else if (key.downArrow || input === 'j') {
            setSelectedIndex((i) => (i + 1) % PRESETS.length);
        } else if (key.return || input === ' ') {
            const preset = PRESETS[selectedIndex];
            // TODO: call core initProject({ preset })
            // eslint-disable-next-line no-console
            console.log(`Init project with preset: ${preset}`);
            // later you can switch back to home or show log
        }
    });

    return (
        <Box flexDirection='column' padding={1}>
            <Text color='green'>New project</Text>
            <Text>Select a preset:</Text>
            {PRESETS.map((preset, idx) => (
                <Text key={preset} inverse={idx === selectedIndex}>
                    {idx === selectedIndex ? '› ' : '  '}
                    {preset}
                </Text>
            ))}
        </Box>
    );
};
