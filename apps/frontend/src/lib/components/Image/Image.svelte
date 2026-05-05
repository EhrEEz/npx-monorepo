<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Media } from '$backend/src/payload-types';
	import default_image from '$lib/assets/default-image.webp';
	import { env } from '$env/dynamic/public';
	const media_url = env.PUBLIC_API_URL;

	const {
		image,
		loading = 'lazy',
		alternate_alt,
		class: className,
		...restProps
	}: {
		image: Media;
		alternate_alt?: string;
		loading?: 'lazy' | 'eager';
	} & HTMLAttributes<HTMLImageElement> = $props();
</script>

{#if image.sizes}
	<img
		{loading}
		src={image.sizes.small?.url
			? media_url + image.sizes.small?.url
			: image.url
				? media_url + image.url
				: default_image}
		srcset="
				{image?.sizes?.small?.url ? `${media_url + image.sizes.small.url} 234w,` : ''}
				{image?.sizes?.card?.url ? `${media_url + image.sizes.card.url} 500w,` : ''}
				{image?.sizes?.tablet?.url ? `${media_url + image.sizes.tablet.url} 750w,` : ''}
				{image?.sizes?.desktop?.url ? `${media_url + image.sizes.desktop.url} 1000w,` : ''}"
		class={['', className]}
		alt="Cover of {image.alt ?? image.alt ?? alternate_alt}"
		{...restProps}
	/>
{:else}
	<img
		{loading}
		src={image?.url ? media_url + image.url : default_image}
		class={['', className]}
		alt="Cover of {image.alt ?? image.alt ?? alternate_alt}"
		{...restProps}
	/>
{/if}

<style lang="scss">
	.article {
		&__image {
			aspect-ratio: 16 /9;
			inline-size: 100%;
		}
	}
</style>
