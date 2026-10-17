import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
	plugins: [
		tailwindcss(),
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations
			// for more information about preprocessors
			preprocess: vitePreprocess(),

			adapter: adapter(),

			paths: {
				// GitHub Pages serves the site from /<repository-name>, set via BASE_PATH in CI
				base:
					command === 'serve' && !isPreview
						? ''
						: (process.env.BASE_PATH as '' | `/${string}` | undefined)
			}
		})
	],

	server: {
		host: true // Access inside container
	}
}));
