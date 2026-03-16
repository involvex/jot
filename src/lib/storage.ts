import fs from 'fs/promises'
import path from 'path'
import os from 'os'

export interface Note {
	id: string
	title?: string
	content: string
	timestamp: number
}

const APP_NAME = '.jot'

function getConfigDir() {
	return path.join(os.homedir(), APP_NAME)
}

export const STORAGE_DIR = getConfigDir()
const STORAGE_FILE = path.join(STORAGE_DIR, 'notes.json')

async function ensureStorage() {
	try {
		await fs.access(STORAGE_DIR)
	} catch {
		await fs.mkdir(STORAGE_DIR, {recursive: true})
	}

	try {
		await fs.access(STORAGE_FILE)
	} catch {
		await fs.writeFile(STORAGE_FILE, JSON.stringify([]))
	}
}

export async function getNotes(): Promise<Note[]> {
	await ensureStorage()
	const data = await fs.readFile(STORAGE_FILE, 'utf-8')
	try {
		return JSON.parse(data) as Note[]
	} catch {
		return []
	}
}

export async function saveNotes(notes: Note[]): Promise<void> {
	await ensureStorage()
	await fs.writeFile(STORAGE_FILE, JSON.stringify(notes, null, 2))
}

export async function addNote(note: Note): Promise<void> {
	const notes = await getNotes()
	notes.unshift(note)
	await saveNotes(notes)
}

export async function updateNote(updatedNote: Note): Promise<void> {
	const notes = await getNotes()
	const index = notes.findIndex(n => n.id === updatedNote.id)
	if (index !== -1) {
		notes[index] = updatedNote
		await saveNotes(notes)
	}
}

export async function deleteNote(id: string): Promise<void> {
	const notes = await getNotes()
	const filtered = notes.filter(n => n.id !== id)
	await saveNotes(filtered)
}
