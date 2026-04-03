<script lang="ts">
	import '$lib/scss/styles.scss';

	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

{@render children()}
