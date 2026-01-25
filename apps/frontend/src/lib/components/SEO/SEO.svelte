<script lang="ts">
	import { page } from '$app/state';
	const { pageSettings, siteSettings, media_url } = $props();

	const global = $derived(siteSettings.global_seo);
	const pageURL = $derived(page.url.href);
	const homepageURL = $derived(page.url.origin);

	const title = $derived.by(() => {
		if (pageSettings && pageSettings.page_title) {
			return pageSettings.page_title;
		}
		return global.default_title;
	});

	const og_title = $derived.by(() => {
		if (pageSettings && pageSettings.page_seo && pageSettings.page_seo.meta_title) {
			return pageSettings.page_seo.meta_title;
		}
		if (title) {
			return title;
		}
		return global.default_title;
	});

	const site_name = $derived(global.site_name ?? global.default_title);
	const og_image = $derived.by(() => {
		if (pageSettings && pageSettings.page_seo && pageSettings.page_seo.meta_image) {
			return pageSettings.page_seo.meta_image.media;
		}
		return global.default_og_image;
	});
	const keywords = $derived.by(() => {
		if (pageSettings && pageSettings.page_seo && pageSettings.page_seo.keywords) {
			return pageSettings.page_seo.keywords;
		}
		return global.default_keywords;
	});

	const og_description = $derived.by(() => {
		if (pageSettings && pageSettings.page_seo && pageSettings.page_seo.meta_description) {
			return pageSettings.page_seo.meta_description;
		}
		return siteSettings.description;
	});
	let preventIndexing = $derived.by(() => {
		if (pageSettings && pageSettings.page_seo) {
			return pageSettings.page_seo;
		}
		return false;
	});
</script>

<svelte:head>
	<title>{title} | {global.title_suffix ?? siteSettings.name}</title>

	<link rel="canonical" href={pageURL} />
	<meta name="description" content={og_description} />
	<meta property="og:description" content={og_description} />
	<meta itemprop="description" content={og_description} />
	<meta name="twitter:description" content={og_description} />

	<meta property="og:title" content="{og_title} | {global.title_suffix ?? siteSettings.name}" />
	<meta itemprop="name" content="{og_title} | {global.title_suffix ?? siteSettings.name}" />
	<meta name="twitter:title" content="{og_title} | {global.title_suffix ?? siteSettings.name}" />

	<meta name="keywords" content={keywords} />

	<meta
		itemprop="image"
		content={media_url +
			(og_image?.formats?.small.url ?? og_image?.formats?.thumbnail?.url ?? og_image.url)}
	/>
	<meta
		name="twitter:image"
		content={media_url +
			(og_image?.formats?.small.url ?? og_image?.formats?.thumbnail?.url ?? og_image.url)}
	/>
	<meta
		name="og:image"
		content={media_url +
			(og_image?.formats?.small.url ?? og_image?.formats?.thumbnail?.url ?? og_image.url)}
	/>

	<meta property="og:url" content={pageURL} />
	<meta property="og:site_name" content={site_name} />
	<meta property="og:see_also" content={homepageURL} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:url" content={pageURL} />
	{#if !preventIndexing}
		<meta name="robots" content="noindex, follow" />
	{/if}
	<script
		src="https://analytics.ahrefs.com/analytics.js"
		data-key="sHZ9FbtHCR9mC4PEIQgGsw"
		async
	></script>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-VL6VP0948Z"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-VL6VP0948Z');
	</script>
</svelte:head>
