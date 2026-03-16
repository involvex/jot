# Agents.md

Agent instructions and guidelines for the Jot project.

## Project Overview

**Jot** is a Bun-powered interactive CLI note-taking application built with React and Ink. It provides a terminal-based user interface for creating and managing notes.

- **Package Manager**: Bun
- **Language**: TypeScript
- **UI Framework**: Ink (React for CLI)
- **Testing**: AVA
- **Linting**: XO + ESLint
- **Formatting**: Prettier

## Useful Commands

### Development

```bash
# Run the CLI application in development mode
bun run dev

# Run tests
bun run test

# Run tests with verbose output
bun run test -- --verbose
```

### Code Quality

```bash
# Format code with Prettier
bun run format

# Lint code
bun run lint

# Lint and auto-fix issues
bun run lint:fix

# Type check without emitting
bun run typecheck
```

### Build

```bash
# Build the project (compiles TypeScript to JavaScript)
bun run build

# Prebuild runs format, lint:fix, and typecheck before building
bun run prebuild
```

### Installation

```bash
# Install the CLI globally
bun add -g

# Or link for local development
bun link
```

## Technologies

### Core Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **UI Framework**: Ink (React for terminal)
- **React**: Version 18.2.0

### Dependencies

- **CLI UI**: `ink` - React for interactive CLI
- **Input Handling**: `ink-text-input` - Text input component for Ink
- **CLI Helpers**: `meow` - CLI argument parser, `clipboardy` - Clipboard access
- **Utilities**: `date-fns` - Date formatting, `nanoid` - Unique ID generation

### Development Tools

- **Testing**: AVA - Node.js test runner
- **Linting**: XO - Opinionated ESLint wrapper, ESLint with TypeScript support
- **Formatting**: Prettier with custom config (`@involvex/prettier-config`)
- **Type Checking**: TypeScript

## Best Practices and Guidelines

### Code Style

1. **Follow XO Linting Rules**: The project uses XO with React extensions. Run `bun run lint` before committing.

2. **Use Prettier for Formatting**: All code should be formatted with Prettier. Run `bun run format`.

3. **TypeScript Strict Mode**: Avoid `any` types. Define proper interfaces for all data structures.

### File Organization

```
src/
├── cli.tsx           # Main CLI entry point
├── app.tsx          # Main App component
├── commands/        # Command implementations
│   ├── about.tsx
│   ├── help.tsx
│   └── version.tsx
├── components/      # Reusable UI components
│   ├── menu.tsx
│   └── select-input.tsx
└── lib/            # Utilities and storage
    └── storage.ts
```

### Component Guidelines

1. **Ink Components**: All UI components use Ink's `Box`, `Text`, and other components.

2. **State Management**: Use React hooks (`useState`, `useEffect`) for local state.

3. **Props Types**: Define TypeScript interfaces for component props.

```typescript
interface MenuProps {
	options: string[]
	onSelect: (index: number) => void
}
```

### Import Organization

Imports should be organized in the following order (Prettier handles this automatically):

1. External libraries (React, Ink, etc.)
2. Internal packages
3. Local imports (./_, ../_)

### Error Handling

Always handle errors gracefully in CLI applications:

```typescript
try {
	// Operation that might fail
} catch (error) {
	console.error('Error message:', error.message)
	process.exit(1)
}
```

### Testing

1. **AVA Test Framework**: Write tests using AVA's syntax.

2. **Test File Naming**: Use `*.test.ts` or `*.test.tsx` extension.

3. **Example Test**:

```typescript
import test from 'ava'

test('should format date correctly', t => {
	const result = formatDate(new Date('2024-01-01'))
	t.is(result, 'Jan 1, 2024')
})
```

### CLI Best Practices

1. **Exit Codes**: Use proper exit codes (0 for success, 1 for errors).

2. **User Feedback**: Provide clear feedback for all user actions.

3. **Keyboard Input**: Handle keyboard events appropriately for CLI interaction.

### Pre-commit Checklist

Before committing code, ensure:

- [ ] `bun run format` passes
- [ ] `bun run lint:fix` passes (or manually fix issues)
- [ ] `bun run typecheck` passes
- [ ] `bun run test` passes
- [ ] New code has appropriate tests

### Working with React in CLI

1. **Render Loop**: Remember Ink uses its own render loop. Use `useInput` hook for keyboard handling.

2. **Focus Management**: Handle focus states for interactive elements.

3. **Terminal Dimensions**: Use `<Box>` with proper dimensions for layout.

## Project Configuration

### TypeScript (tsconfig.json)

- Strict mode enabled
- ESNext module resolution
- React JSX support

### ESLint / XO (eslint.config.ts)

- Extends `xo-react` configuration
- Prettier integration enabled
- React prop-types disabled (using TypeScript)

### Prettier

- Uses `@involvex/prettier-config`
- Organizes imports automatically
- Sorts imports using multiple plugins

## Additional Resources

- [Ink Documentation](https://github.com/vadimdemedes/ink) - React for CLI
- [Bun Documentation](https://bun.sh) - JavaScript runtime
- [AVA Documentation](https://github.com/avajs/ava) - Test framework
- [XO Linter](https://github.com/xojs/xo) - Opinionated linter
