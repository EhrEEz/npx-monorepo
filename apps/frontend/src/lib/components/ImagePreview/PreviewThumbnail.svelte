<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import type { Media } from '$backend/src/payload-types';
	import { preview } from './preview.svelte.js';
	import type { Snippet } from 'svelte';

	const {
		image,
		alt = undefined,
		children
	}: { image: Media; alt?: string | undefined; children: Snippet } = $props();

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
</script>

<button onclick={() => preview.openPreview(image, alt ? alt : '')} class="preview__thumbnail">
	{@render children()}
</button>
