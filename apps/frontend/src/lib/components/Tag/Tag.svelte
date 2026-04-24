<script lang="ts">
	// import { cn } from '$lib/utils/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const {
		children,
		class: className,
		variant = 'fill',
		color = 'white',
		size = 'medium',
		curvature = 'medium'
	}: {
		children: Snippet;
		variant?: 'outline' | 'fill' | 'mix';
		color?: 'white' | 'black' | 'dark' | 'grey' | 'dark-grey' | 'light' | 'accent' | 'mix-accent';
		size?: 'small' | 'medium' | 'large';
		curvature?: 'large' | 'medium' | 'full';
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<span class={[`tag--${variant} tag--${color} tag--${size} curvature--${curvature}`, className]}>
	{@render children?.()}
</span>
