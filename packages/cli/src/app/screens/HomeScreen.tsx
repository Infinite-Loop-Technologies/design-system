// src/app/screens/HomeScreen.tsx
import React from 'react';
import { Box, Text } from 'ink';

export const HomeScreen: React.FC = () => (
    <Box flexDirection='column' padding={1}>
        <Text color='green'>loop-kit</Text>
        <Text>Left-hand commands:</Text>
        <Text> a – new project (Next + Jazz preset)</Text>
        <Text> s – browse registry (shadcn + custom)</Text>
        <Text> d – doctor / dry-run checks</Text>
        <Text> q – quit</Text>
        <Text> z – show this help in status bar</Text>
    </Box>
);
