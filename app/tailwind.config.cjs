/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#F7FEE7',
					100: '#ECFCCB',
					200: '#D9F99D',
					300: '#BEF264',
					400: '#A3E635',
					500: '#84CC16',
					600: '#65A30D',
					700: '#4D7C0F',
					800: '#3F6212',
					900: '#365314'
				}
			}
		}
	}
};

module.exports = config;
