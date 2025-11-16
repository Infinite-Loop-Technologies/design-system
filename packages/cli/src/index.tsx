// src/index.tsx
import React from 'react';
import { render } from 'ink';
import { Root } from './app/Root';

// Library/programmatic entrypoint
export const runCli = () => {
    const instance = render(<Root />);
    return instance; // caller can unmount() if needed
};

// When executed as CLI (Node bin), just run it.
if (require.main === module) {
    runCli();
}
