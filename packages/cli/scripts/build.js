import { build } from 'tsdown'

await build({
  entry: ['src/index.tsx'],
  format: ['esm'],
  outDir: 'dist',
  dts: true,
  tsconfig: './tsconfig.json',
  banner: '#!/usr/bin/env node',
  watch: true
})