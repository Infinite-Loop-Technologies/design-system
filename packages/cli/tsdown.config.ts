import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.tsx'],
    format: ['esm'],
    outDir: 'dist',
    dts: true,
    tsconfig: './tsconfig.json',
    banner: '#!/usr/bin/env node',
});
