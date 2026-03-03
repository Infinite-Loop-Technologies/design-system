# loop-kit

Experimental full-stack toolkit for composing apps and games from WASM components, incremental effect systems, and capability-driven hosts.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run Rust CLI
cargo run -p loop-cli -- --help

# Dev mode (pick one)
pnpm --filter @loop/cli dev            # TypeScript CLI
pnpm --filter @loop-kit/registry dev   # Registry library
pnpm --filter registry dev             # Next.js site
```

## Loop CLI Dogfooding

- `pnpm run loop -- <args>` runs the pinned stable CLI from npm.
- `pnpm run loop:stable -- <args>` runs the pinned stable CLI explicitly.
- `pnpm run loop:dev -- <args>` runs the workspace CLI under active development.
- `pnpm run loop:local -- <args>` is kept as an alias of `loop:dev`.
- `pnpm run loop:smoke -- --cwd .` runs `loop doctor` through both stable and dev CLIs.
  - Stable CLI smoke is a hard requirement.
  - Dev CLI smoke is best-effort (warn-only) so CI is not blocked by in-flight dev breakage.

Stable CLI pin location:

- `tools/release/loop-cli-stable.json` (bump `version` here when promoting a new stable CLI).

## Local Publish Pipeline

- `pnpm run release:publish:all` runs Moon gates (`typecheck`, `build`, `test`) and publishes the configured public package allowlist.
- `pnpm run release:publish:all:dry` performs a dry run.

## Core Concepts

- **WASM-first**: Components as the default unit of composition
- **Capability-driven**: Pluggable providers for UI, GPU, storage, networking
- **Incremental effects**: React-like reconciliation via `loop:fx`
- **Tooling as code**: Workspaces ship their own CLIs and editors

## Project Structure

```
loop-kit/
├── crates/          # Rust: Wasmtime host, CLI tools
├── packages/        # TypeScript: CLI, registry, site
├── wit/             # Component interface definitions (WIT)
├── knowledge/       # Design docs and research notes
└── .claude/         # Claude Code rules and guidelines
```

## Documentation

- **CLAUDE.md** - Comprehensive guide for AI assistants
- **.claude/rules/** - Detailed development rules
  - `architecture.md` - Core design principles
  - `wit-syntax.md` - WIT syntax and validation
  - `capabilities.md` - Capability system details
  - `development.md` - Workflow and conventions
  - `testing.md` - Testing guidelines
- **knowledge/** - Research and design notes
  - `capabilities-runtime.md` - Capability providers and transports
  - `effect-system.md` - Incremental effect system (loop:fx)
  - `wit-notes.md` - WIT usage and composition
  - `wasm-tooling.md` - WASM/WIT toolchain cheatsheet

## Current Focus

Building a local Rust Wasmtime host for running WASM components with:
- Logging, filesystem, HTTP providers
- UI/window capabilities via `loop:ui` and `loop:window`
- CLI scaffolding for creating components and hosts
- Example components demonstrating capabilities

Remote capabilities (wRPC, wasmCloud, OCI) are backlogged until the local host loop is stable.

## License

MIT
