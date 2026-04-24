import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		imagetools({
			include: ['**/src/lib/assets/**/*']
		}),
		sveltekit()
	],
	ssr: {
		noExternal: [/gsap/],
		external: ['payload', 'sharp']
	},
	build: {
		sourcemap: false,
		chunkSizeWarningLimit: 2000
	},
	server: {
		fs: {
			allow: ['../..']
		}
	}
});
