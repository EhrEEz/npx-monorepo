<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const {
		class: className,
		href,
		children,
		onClick = undefined,
		scrollTo = undefined,
		...restProps
	} = $props();
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	const smooth: ScrollSmoother = getContext('smooth');

	let pathName = $derived(page.url.pathname);

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		if (onClick) {
			onClick();
		}
		if (scrollTo && smooth) {
			if (!href) {
				console.log(href);
				return;
			}
			const linkAddress = new URL(href, page.url.origin);
			const linkPath = linkAddress.pathname;
			const linkHash = linkAddress.hash;

			if (linkAddress) {
				if (linkPath === '') {
					smooth.scrollTo(linkAddress.toString(), true, 'top 100px');
				} else {
					if (pathName === linkPath) {
						smooth.scrollTo(linkHash, true, 'top 100px');
					} else {
						goto(linkAddress);
					}
				}
			}
		}

		if (!smooth || !scrollTo) {
			goto(href);
		}
	}
</script>

<a class={className} {href} {...restProps} onclick={handleClick}>
	{@render children()}
</a>
