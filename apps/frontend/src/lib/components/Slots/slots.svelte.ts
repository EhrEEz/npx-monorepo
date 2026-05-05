import { getContext, setContext, type Snippet } from 'svelte';

const key = Symbol('layout-slots');

type Slots = Record<string, Snippet>;

export function initSlots(): Slots {
	const slots: Slots = $state({});
	setContext(key, slots);
	return slots;
}

export function useSlot(name: string, snippet: Snippet) {
	const context = getContext<Slots>(key);

	context[name] = snippet;

	return () => {
		delete context[name];
	};
}
