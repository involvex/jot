import pluginReact from 'eslint-plugin-react'
import {defineConfig} from 'eslint/config'
import tseslint from 'typescript-eslint'
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'
import globals from 'globals'
import js from '@eslint/js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: {js},
		extends: ['js/recommended'],
		languageOptions: {globals: {...globals.node}},
	},
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,mts,cts,jsx,tsx}'],
		languageOptions: {
			globals: {...globals.node},
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
	},
	{
		files: ['**/*.jsx', '**/*.tsx'],
		...pluginReact.configs.flat['recommended'],
		settings: {
			react: {version: 'detect'},
			jsxRuntime: 'automatic',
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
])
