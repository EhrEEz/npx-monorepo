<script module lang="ts">
	export interface SortOption {
		name: string;
		value: string;
	}
</script>

<script lang="ts">
	import type { ChangeEventHandler, HTMLAttributes } from 'svelte/elements';

	let {
		options,
		current = $bindable(),
		onAction,
		class: className
	}: {
		options: SortOption[];
		current: SortOption;
		onAction: ChangeEventHandler<HTMLSelectElement>;
	} & HTMLAttributes<HTMLSelectElement> = $props();
</script>

<div class="sort-wrapper fl-row gap-1 al-center">
	<select class={[className, 'select--sort']} bind:value={current.value} onchange={onAction}>
		{#each options as option}
			<option value={option.value}>{option.name}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	:global([class*='select-']) {
		appearance: none;
		--_border-color: var(--clr-neutral-600);
		--_background-color: var(--_clr-neutral-700);
		--_color: var(--clr-neutral-200);
		outline: none;
		display: inline-flex;
		padding: 0.5em 2em 0.5em 1em;
		border-radius: 100vmax;
		background-color: var(--_background-color);

		background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.9902 10.889L12.0022 14.307L8.01416 10.889L8.99016 9.74902L12.0022 12.331L15.0142 9.75002L15.9902 10.889Z' fill='white'/%3E%3C/svg%3E%0A");
		background-position: 90% center;
		background-repeat: no-repeat;

		border: 1px solid var(--_border-color);
		font-size: 0.875rem;

		color: var(--_color);
		// transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);

		&:focus {
			--_background-color: var(--clr-neutral-600);
			--_color: var(--clr-neutral-100);
			--_border-color: var(--set-ui-highlight-color);
		}
	}
</style>
