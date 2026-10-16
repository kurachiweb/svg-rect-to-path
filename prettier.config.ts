import type { Config } from 'prettier';
import type { PluginOptions as TailwindPluginOptions } from 'prettier-plugin-tailwindcss';

export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	tailwindStylesheet: './src/app.css'
} satisfies Config & TailwindPluginOptions;
