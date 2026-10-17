import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { loadConfig } from '@sveltejs/load-config';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

// SvelteKit 3 has no svelte.config.js, so read the options passed to `sveltekit()` in vite.config.ts
const loaded = await loadConfig(fileURLToPath(new URL('.', import.meta.url)), { traverse: false });
if (loaded && 'error' in loaded) throw loaded.error;
const svelteConfig = loaded?.config;

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: {
			parserOptions: {
				// Keep this consistent for TypeScript and Svelte files to avoid project reloads
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			// TypeScript already checks for undefined variables
			// https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
