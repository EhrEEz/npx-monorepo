<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';

	import Header from '$lib/components/Header.svelte';
	import favicon from '$lib/assets/logo.svg';
	import faviconDark from '$lib/assets/logo-dark.svg';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	import { initAnimations } from '$lib/js/animations';
	import { tick, onMount, setContext, type Snippet } from 'svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import type { SiteSetting } from '$backend/src/payload-types';
	import Loader from '$lib/components/Loader/Loader.svelte';
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	interface Props {
		children: Snippet;
		data: {
			siteSettings: SiteSetting;
		};
	}
	let { data, children }: Props = $props();

	setContext('site-settings', {
		get settings() {
			return data.siteSettings;
		}
	});

	let showLoader = $state(true);
	let smooth = $state<ScrollSmoother>();
	setContext('smooth', {
		get smooth() {
			return smooth;
		}
	});

	beforeNavigate(() => {
		showLoader = true;

		if (smooth) smooth.paused(true);

		ScrollTrigger.getAll().forEach((t) => t.kill());

		gsap.globalTimeline.pause();
	});
	function waitForImages(): Promise<void> {
		return new Promise((resolve) => {
			const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
			const unloaded = images.filter((img) => !img.complete);

			if (unloaded.length === 0) {
				resolve();
				return;
			}

			let count = 0;
			const done = () => {
				count++;
				if (count >= unloaded.length) resolve();
			};

			unloaded.forEach((img) => {
				img.addEventListener('load', done, { once: true });
				img.addEventListener('error', done, { once: true });
			});

			// Safety fallback
			setTimeout(resolve, 5000);
		});
	}

	onMount(async () => {
		smooth = ScrollSmoother.create({
			smooth: 1,
			effects: true,
			smoothTouch: 0,
			wrapper: '#smooth-wrapper',
			content: '#smooth-content'
		});

		await waitForImages();

		requestAnimationFrame(() => {
			ScrollTrigger.refresh();
			window.dispatchEvent(new CustomEvent('page-ready'));
		});
	});

	afterNavigate(async () => {
		await tick();

		await waitForImages();

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				// Reset scroll position first
				if (smooth) {
					smooth.scrollTo(0, false);
					smooth.paused(false);
				}

				// Hard refresh so GSAP has correct measurements
				ScrollTrigger.refresh();

				// Now re-init all animations from scratch
				gsap.globalTimeline.resume();
				initAnimations();

				// Signal header to re-init its triggers
				window.dispatchEvent(new CustomEvent('page-ready'));

				const hash = window.location.hash;

				if (smooth && hash) {
					smooth.scrollTo(hash, true);
				}

				showLoader = false;
			});
		});
	});
</script>

<svelte:head>
	<!-- Google Fonts API -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&display=swap"
		rel="stylesheet"
	/>

	<link rel="icon" href={favicon} type="image/svg+xml" media="(prefers-color-scheme: dark)" />
	<link rel="icon" href={faviconDark} type="image/svg+xml" media="(prefers-color-scheme: light)" />
</svelte:head>

<Header />
<svelte:body style:overflow={showLoader ? 'hidden' : 'auto'} />
<main id="smooth-wrapper" class="content">
	<div id="smooth-content" class="content-grid smooth-content">
		{@render children()}
		<Footer />
	</div>
</main>
<Loader show={showLoader} message="Syncing Interface" />
