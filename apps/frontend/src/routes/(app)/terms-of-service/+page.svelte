<script lang="ts">
	import '$lib/scss/pages/_blogs.scss';
	import Tag from '$lib/components/Tag/Tag.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import moment from 'moment';
	import SEO from '$lib/components/SEO/SEO.svelte';
	import { browser } from '$app/environment';
	import RichText from '$lib/components/RichText/RichText.svelte';
	import type { TermsOfService } from '$backend/src/payload-types.js';
	const { data } = $props();
	const page_seo = $derived(data.page_seo);
	const mainData = $derived<TermsOfService>(data.terms_of_service);

	const updated_on = $derived.by(() => {
		return moment(mainData.updatedAt).format('MMM DD, YYYY');
	});

	function afterRun() {
		gsap.registerPlugin(ScrollTrigger);
		if (browser) {
			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});
		}
	}
</script>

<SEO pageSettings={page_seo} />
<section class="pt-7 pb-4 py-md-6 py-lg-9">
	<article>
		<h1 class="heading-1 mb-4">Terms of Service</h1>
		<div class="fl-row al-center gap-1 mb-3">
			<Tag variant="outline" color="accent" size="small">Last Updated: {updated_on}</Tag>
		</div>
		<div class="article-content mt-3 mt-lg-5">
			<RichText content={mainData.content} {afterRun} />
		</div>
	</article>
</section>
