<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import { getContext } from 'svelte';
	import Image from '../Image/Image.svelte';
	import { preview } from './preview.svelte.js';

	type SmoothType = { smooth: ScrollSmoother | null };

	const smoothInstance = $derived<ScrollSmoother | null>(getContext<SmoothType>('smooth').smooth);

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	$effect(() => {
		if (preview.open) {
			smoothInstance?.paused(true);
		} else {
			smoothInstance?.paused(false);
		}
	});
</script>

{#if preview.open}
	<div class="preview__wrapper active">
		<button
			class="preview__close"
			onclick={() => {
				preview.closePreview();
			}}><span class="sr-only">Close Preview</span></button
		>
		{#if preview.image}
			<div class="preview__image">
				<Image image={preview.image} alternate_alt={preview.alt} />
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.preview {
		&__wrapper {
			position: fixed;
			inset: 0;
			background-color: var(--clr-dark-1000);
			display: block;
			z-index: 1000;
			visibility: hidden;
			opacity: 0;
			&.active {
				visibility: visible;
				opacity: 1;
			}
		}
		&__image {
			overflow-y: scroll;
			block-size: 100%;
			inline-size: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			:global(img) {
				inline-size: 100%;
				block-size: auto;
			}

			@media screen and (width<768px) {
				overflow: hidden;
			}
		}
		&__close {
			position: absolute;
			inset-inline-end: 0;
			inset-block-start: 0;
			inline-size: 6rem;
			aspect-ratio: 1;
			background-repeat: no-repeat;
			background-size: 3rem;
			background-position: center center;
			mix-blend-mode: exclusion;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' id='fi_12143800'%3E%3Cg clip-path='url(%23clip0_17_19219)'%3E%3Cpath d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='%23ffffff'%3E%3C/path%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_17_19219'%3E%3Crect width='24' height='24' fill='white'%3E%3C/rect%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
		}
	}
</style>
