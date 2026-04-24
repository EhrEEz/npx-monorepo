import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit()],
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
