<script lang="ts" module>
	export type PreviewImage = Media;
</script>

<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import { getContext, type Snippet } from 'svelte';
	import type { Media } from '$backend/src/payload-types';
	import { openPreview } from './preview.svelte.js';

	type SmoothType = { smooth: ScrollSmoother | null };

	const {
		image,
		alt = undefined,
		children
	}: { image: PreviewImage; alt?: string | undefined; children: Snippet } = $props();

	const isOpen = $state<boolean>(false);
	const smoothInstance = $derived<ScrollSmoother | null>(getContext<SmoothType>('smooth').smooth);

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
	$effect(() => {
		if (isOpen) {
			openPreview(image, alt ? alt : '');
			smoothInstance?.paused(true);
		}
	});
</script>

<button onclick={() => openPreview(image, alt ? alt : '')} class="preview__thumbnail">
	{@render children()}
</button>
