# GEMINI.md - Jot CLI Context

## Project Overview

**Jot** is an interactive, Bun-powered CLI note-taking application. It is built using [Ink](https://github.com/vadimdemedes/ink), which brings React's component-based architecture to the terminal.

- **Primary Goal**: Provide a fast, beautiful, and interactive way to manage notes directly from the terminal.
- **Key Features**:
  - **Quick Notes**: Save notes directly via CLI arguments (e.g., `jot "buy milk"`).
  - **Interactive TUI**: A full terminal interface for browsing, viewing, renaming, and deleting notes.
  - **Editor Integration**: Opens the system's `$EDITOR` (defaults to `nano`) for editing note content.
  - **Clipboard Support**: Integrated pasting from the system clipboard.
  - **Persistence**: Notes are stored as a JSON array in `~/.jot/notes.json`.

## Technical Stack

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript (strict mode)
- **UI Framework**: [Ink](https://github.com/vadimdemedes/ink) (React 18.2)
- **CLI Parser**: [Meow](https://github.com/sindresorhus/meow)
- **Testing**: [AVA](https://github.com/avajs/ava)
- **Linting/Formatting**: [XO](https://github.com/xojs/xo) (ESLint wrapper) and [Prettier](https://prettier.io)
- **Date Utilities**: [date-fns](https://date-fns.org)

## Project Structure

- `src/cli.tsx`: The main entry point. Handles CLI flag parsing (`--help`, `--version`, `--about`) and decides whether to launch the TUI (`App`) or save a quick note.
- `src/app.tsx`: The core React component for the TUI. Manages navigation state (list, detail, menu, rename, delete) and keyboard input via `useInput`.
- `src/lib/storage.ts`: Handles all filesystem operations, including ensuring the `~/.jot` directory exists and performing CRUD operations on the `notes.json` file.
- `src/components/`: Contains reusable TUI components.
  - `select-input.tsx`: A custom, stable implementation of a selection list that avoids common re-registration bugs in native Ink components.
- `src/commands/`: Static informational components (`help.tsx`, `about.tsx`, `version.tsx`).

## Development Workflow

### Building and Running

- **Development**: `bun run dev` (Runs `src/cli.tsx` directly via Bun).
- **Build**: `bun run build` (Compiles TypeScript to `dist/`).
- **Typecheck**: `bun run typecheck` (Runs `tsc --noEmit`).

### Testing and Quality

- **Test**: `bun run test` (Runs Prettier check, XO linting, and AVA tests).
- **Lint**: `bun run lint` (or `bun run lint:fix` to auto-fix).
- **Format**: `bun run format` (Runs Prettier).
- **Prebuild**: `bun run prebuild` (Runs format, lint:fix, and typecheck before a build).

## Development Conventions

1. **Ink UI Components**: Use standard Ink components (`Box`, `Text`) for layout. Prefer custom `SelectInput` for lists.
2. **Keyboard Handling**: Use the `useInput` hook for TUI interactivity. Be mindful of screen state when capturing keys.
3. **Data Integrity**: All notes must have a `nanoid` ID and a `timestamp`.
4. **Error Handling**: Use `try/catch` blocks for filesystem and clipboard operations, providing user-friendly error messages via `Text` components.
5. **Linting**: Adhere to XO's strict rules. If `bun run lint:fix` doesn't resolve an issue, check `eslint.config.ts`.
