#!/usr/bin/env node
import DisplayVersion from './commands/version.js'
import {addNote} from './lib/storage.js'
import About from './commands/about.js'
import Help from './commands/help.js'
import {nanoid} from 'nanoid'
import App from './app.js'
import {render} from 'ink'
import React from 'react'
import meow from 'meow'

const cli = meow(
	`
	Usage
	  $ jot [note content]

	Options
		--version  Show version
		--about    Show about
		--help     Show help

	Examples
	  $ jot "Meeting at 3pm"
	  $ jot
`,
	{
		importMeta: import.meta,
		flags: {
			version: {
				type: 'boolean',
			},
			about: {
				type: 'boolean',
			},
			help: {
				type: 'boolean',
			},
		},
	},
)

async function run() {
	if (cli.flags.help || cli.input[0] === 'help') {
		render(<Help />)
	} else if (cli.flags.version || cli.input[0] === 'version') {
		render(<DisplayVersion />)
	} else if (cli.flags.about || cli.input[0] === 'about') {
		render(<About />)
	} else if (cli.input.length > 0) {
		const content = cli.input.join(' ')
		await addNote({
			id: nanoid(),
			content,
			timestamp: Date.now(),
		})
		console.log('✅ Note saved!')
	} else {
		render(<App />)
	}
}

run()
