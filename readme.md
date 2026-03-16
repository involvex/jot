# jot 📝

A Bun-powered, interactive CLI note-taking application built with [Ink](https://github.com/vadimdemedes/ink).

## Features

- **Quick Notes**: Create notes directly from the command line.
- **Interactive TUI**: Manage your notes in a beautiful terminal interface.
- **Markdown Support**: Notes are edited as Markdown files in your favorite editor.
- **Smart Storage**: Persistent storage in `~/.jot` with automatic timestamping.
- **Clipboard Integration**: Paste text into new or existing notes with `p` or `Ctrl+V`.
- **Note Management**: Rename, delete, and copy note content through an intuitive action menu.

## Install

```bash
$ npm install --global jot
```

## Usage

### Quick Note

Create a note instantly without entering the TUI:

```bash
$ jot "Meet with Sarah at 3pm"
```

### Interactive Mode

Launch the full interface to browse and manage notes:

```bash
$ jot
```

### Options

```bash
$ jot --help

  Usage
    $ jot [note content]

  Options
    --version  Show version
    --about    Show about
    --help     Show help

  Examples
    $ jot "Meeting at 3pm"
    $ jot
```

## TUI Keybindings

- **↑/↓**: Navigate the note list or menus.
- **Enter**: View the selected note.
- **n**: Create a new note (opens your `$EDITOR`).
- **p / Ctrl+V**: Paste from system clipboard.
- **e**: Open the **Note Actions** menu (Rename, Edit, Copy, Delete).
- **Esc**: Go back to the previous screen or exit.

## Configuration

`jot` respects the `$EDITOR` environment variable for editing notes. If not set, it defaults to `nano`.

Data is stored in `~/.jot/notes.json`.

---

Generated with [create-ink-app](https://github.com/vadimdemedes/create-ink-app)
