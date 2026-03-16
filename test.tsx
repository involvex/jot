import {render} from 'ink-testing-library'
import App from './src/app.js'
import React from 'react'
import test from 'ava'

test('app renders', t => {
	const {lastFrame} = render(<App />)

	t.truthy(lastFrame())
})
