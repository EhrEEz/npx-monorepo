<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import { getContext } from 'svelte';
	import Image from '../Image/Image.svelte';

	import { preview, closePreview } from './preview.svelte.js';

	type SmoothType = { smooth: ScrollSmoother | null };

	const isOpen = $state<boolean>(false);
	const smoothInstance = $derived<ScrollSmoother | null>(getContext<SmoothType>('smooth').smooth);

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	function handleOpen() {
		if (isOpen) {
			smoothInstance?.paused(true);
			closePreview();
		}
	}
</script>

<div class="preview__wrapper" class:active={isOpen}>
	<button class="preview__close" onclick={handleOpen}
		><span class="sr-only">Close Preview</span></button
	>
	{#if preview.image}
		<Image image={preview.image} alternate_alt={preview.alt} />
	{/if}
</div>

<style lang="scss">
	.preview {
		&__wrapper {
			position: fixed;
			inset: 0;
		}
		&__close {
			position: absolute;
			inset-inline-end: 0;
			inset-block-start: 0;
			inline-size: 2rem;
			aspect-ratio: 1;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center center;
			mix-blend-mode: difference;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' id='fi_12143800'%3E%3Cg clip-path='url(%23clip0_17_19219)'%3E%3Cpath d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='%23ffffff'%3E%3C/path%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_17_19219'%3E%3Crect width='24' height='24' fill='white'%3E%3C/rect%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
		}
	}
</style>
