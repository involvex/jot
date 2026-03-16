import {
	deleteNote,
	getNotes,
	Note,
	updateNote,
	addNote,
	STORAGE_DIR,
} from './lib/storage.js'
import SelectInput from './components/select-input.js'
import React, {useEffect, useState} from 'react'
import {Box, Text, useInput} from 'ink'
import TextInput from 'ink-text-input'
import {spawn} from 'child_process'
import clipboard from 'clipboardy'
import {format} from 'date-fns'
import {nanoid} from 'nanoid'
import path from 'path'
import fs from 'fs'

type ViewState = 'list' | 'detail' | 'menu' | 'confirm-delete' | 'rename'

export default function App() {
	const [notes, setNotes] = useState<Note[]>([])
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [view, setView] = useState<ViewState>('list')
	const [message, setMessage] = useState('')
	const [renameValue, setRenameValue] = useState('')

	const refreshNotes = async () => {
		const fetched = await getNotes()
		setNotes(fetched)
	}

	useEffect(() => {
		refreshNotes()
	}, [])

	const selectedNote = notes[selectedIndex]

	const handlePaste = async () => {
		try {
			const content = await clipboard.read()
			if (!content) return

			if (view === 'detail' && selectedNote) {
				await updateNote({
					...selectedNote,
					content: selectedNote.content + '\n' + content,
				})
				setMessage('Pasted into current note')
			} else {
				await addNote({
					id: nanoid(),
					content,
					timestamp: Date.now(),
				})
				setMessage('New note created from clipboard')
			}
			await refreshNotes()
			setTimeout(() => setMessage(''), 2000)
		} catch (_err) {
			setMessage('Error reading clipboard')
		}
	}

	const openEditor = async (note?: Note) => {
		const tmpPath = path.join(STORAGE_DIR, 'tmp')
		if (!fs.existsSync(tmpPath)) {
			fs.mkdirSync(tmpPath, {recursive: true})
		}

		const fileName = `jot-${nanoid(8)}.md`
		const fullPath = path.join(tmpPath, fileName)

		if (note) {
			fs.writeFileSync(fullPath, note.content)
		} else {
			fs.writeFileSync(fullPath, '')
		}

		const editor = process.env['EDITOR'] || 'nano'
		const child = spawn(editor, [fullPath], {
			stdio: 'inherit',
		})

		child.on('exit', async () => {
			if (!fs.existsSync(fullPath)) {
				setView('list')
				return
			}

			const newContent = fs.readFileSync(fullPath, 'utf8')
			if (note) {
				if (newContent !== note.content) {
					await updateNote({...note, content: newContent})
				}
			} else if (newContent.trim()) {
				await addNote({
					id: nanoid(),
					content: newContent,
					timestamp: Date.now(),
				})
			}

			try {
				fs.unlinkSync(fullPath)
			} catch {
				// Ignore errors
			}

			await refreshNotes()
			setView('list')
		})
	}

	useInput(async (input, key) => {
		if (view === 'list') {
			if (key.return && selectedNote) setView('detail')
			if (input === 'e' && selectedNote) setView('menu')
			if (input === 'n') await openEditor()
			if (input === 'p' || (key.ctrl && input === 'v')) await handlePaste()
			if (key.escape) process.exit(0)
		} else if (view === 'detail') {
			if (key.escape) setView('list')
			if (input === 'e') setView('menu')
			if (input === 'p' || (key.ctrl && input === 'v')) await handlePaste()
		} else if (view === 'confirm-delete') {
			if (input === 'y') {
				if (selectedNote) {
					await deleteNote(selectedNote.id)
					await refreshNotes()
					setSelectedIndex(Math.max(0, selectedIndex - 1))
				}
				setView('list')
			} else if (input === 'n' || key.escape) {
				setView('list')
			}
		} else if (view === 'rename') {
			if (key.escape) setView('list')
		}
	})

	const handleRenameSubmit = async () => {
		if (selectedNote) {
			await updateNote({...selectedNote, title: renameValue})
			await refreshNotes()
			setMessage('Note renamed')
			setTimeout(() => setMessage(''), 2000)
		}
		setView('list')
	}

	if (notes.length === 0 && view === 'list') {
		return (
			<Box flexDirection="column" padding={1}>
				<Text color="cyan" bold italic>
					jot
				</Text>
				<Box marginY={1}>
					<Text italic dimColor>
						No notes found. Press 'n' to create one or 'p' to paste.
					</Text>
				</Box>
				{message && <Text color="green">{message}</Text>}
			</Box>
		)
	}

	if (view === 'list') {
		const menuItems = notes.map((note, index) => {
			const titleLine = note.title || note.content.split('\n')[0].slice(0, 40)
			const label = `[${format(note.timestamp, 'yyyy-MM-dd HH:mm')}] ${titleLine}${
				!note.title && note.content.length > 40 ? '...' : ''
			}`
			return {
				label,
				value: index.toString(),
			}
		})

		return (
			<Box flexDirection="column" padding={1}>
				<Box justifyContent="space-between">
					<Text color="cyan" bold italic>
						jot
					</Text>
					<Box>
						<Text dimColor>↑↓: Navigate | </Text>
						<Text dimColor bold color="white">
							Enter
						</Text>
						<Text dimColor>: View | </Text>
						<Text dimColor bold color="white">
							n
						</Text>
						<Text dimColor>: New | </Text>
						<Text dimColor bold color="white">
							p
						</Text>
						<Text dimColor>: Paste | </Text>
						<Text dimColor bold color="white">
							e
						</Text>
						<Text dimColor>: Menu</Text>
					</Box>
				</Box>
				<Box marginY={1}>
					<SelectInput
						items={menuItems}
						onSelect={item => {
							setSelectedIndex(parseInt(item.value, 10))
							setView('detail')
						}}
					/>
				</Box>
				{message && <Text color="green">{message}</Text>}
			</Box>
		)
	}

	if (view === 'detail' && selectedNote) {
		return (
			<Box flexDirection="column" padding={1}>
				<Box
					borderStyle="round"
					borderColor="cyan"
					flexDirection="column"
					paddingX={1}
				>
					<Box justifyContent="space-between" marginBottom={1}>
						<Box>
							{selectedNote.title && (
								<Text bold color="cyan">
									{selectedNote.title} -{' '}
								</Text>
							)}
							<Text bold color="yellow">
								{format(selectedNote.timestamp, 'PPPP p')}
							</Text>
						</Box>
						<Text dimColor>Esc: Back | e: Menu</Text>
					</Box>
					<Text>{selectedNote.content}</Text>
				</Box>
				{message && (
					<Box marginTop={1}>
						<Text color="green">{message}</Text>
					</Box>
				)}
			</Box>
		)
	}

	if (view === 'menu' && selectedNote) {
		const items = [
			{label: 'Edit', value: 'edit'},
			{label: 'Rename', value: 'rename'},
			{label: 'Copy Content', value: 'copy'},
			{label: 'Delete', value: 'delete'},
			{label: 'Back', value: 'back'},
		]

		return (
			<Box flexDirection="column" padding={1}>
				<Text bold color="magenta">
					Note Actions
				</Text>
				<Box marginTop={1}>
					<SelectInput
						items={items}
						onSelect={async item => {
							if (item.value === 'edit') await openEditor(selectedNote)
							if (item.value === 'rename') {
								setRenameValue(selectedNote.title || '')
								setView('rename')
							}
							if (item.value === 'back') setView('list')
							if (item.value === 'copy') {
								await clipboard.write(selectedNote.content)
								setMessage('Copied to clipboard!')
								setTimeout(() => setMessage(''), 2000)
								setView('list')
							}
							if (item.value === 'delete') setView('confirm-delete')
						}}
					/>
				</Box>
			</Box>
		)
	}

	if (view === 'rename' && selectedNote) {
		return (
			<Box padding={1} flexDirection="column">
				<Text bold>Rename Note:</Text>
				<Box marginTop={1} borderStyle="single" borderColor="cyan" paddingX={1}>
					<TextInput
						value={renameValue}
						onChange={setRenameValue}
						onSubmit={handleRenameSubmit}
					/>
				</Box>
				<Box marginTop={1}>
					<Text dimColor>Press Enter to save, Esc to cancel</Text>
				</Box>
			</Box>
		)
	}

	if (view === 'confirm-delete') {
		return (
			<Box padding={1} flexDirection="column">
				<Text color="red" bold>
					Are you sure you want to delete this note?
				</Text>
				<Text dimColor>This action cannot be undone.</Text>
				<Box marginTop={1}>
					<Text color="green">y</Text>
					<Text>es / </Text>
					<Text color="red">n</Text>
					<Text>o</Text>
				</Box>
			</Box>
		)
	}

	return null
}
