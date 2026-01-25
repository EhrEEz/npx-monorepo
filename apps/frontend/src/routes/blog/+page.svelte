<script lang="ts">
	import { ArticleCard } from '$lib/components/Cards';
	import Pagination from '$lib/components/Pagination/Pagination.svelte';
	import config from '$lib/config.js';
	const { data } = $props();

	const page_data = $derived(data.articles);

	let hasNextPage = $derived(page_data.hasNextPage);
	let hasPrevPage = $derived(page_data.hasPrevPage);

	let search_query = $state('');

	let currentSort = $derived(config.blog.sorting);
	let articles = $derived(page_data.docs);
	let currentPage = $derived(parseInt(page_data.page));
	let totalPages = $derived(page_data.totalPages);
	const pageChange = async (page: number) => {
		currentPage = page;
		const params = new URLSearchParams({
			page: page.toString(),
			query: search_query ? `query=${search_query}` : '',
			sort: currentSort ? `sort=${currentSort}` : ''
		});

		const dataResponse = await fetch('/api/findArticles?' + params.toString());
		const newData = await dataResponse.json();
		articles = newData.docs;
		totalPages = newData.totalPages;
		hasNextPage = newData.hasNextPage;
		hasPrevPage = newData.hasPrevPage;
		currentPage = newData.page;
	};
</script>

<section class="blog__header-section my-4 my-md-6 mt-lg-9">
	<h1 class="heading-1"><span class="sr-only">Nepaxis: </span>Article Collection</h1>
</section>
<section class="blog__filter"></section>
<section class="blog__main-section mb-4 mb-md-6 mb-lg-9">
	<div class="fl-row jc-between">
		<p class="uppercase font-mono neutral-400">Showing: {articles.length} Articles</p>
		<!-- <Select
			{options}
			bind:selectedOption={currentSort}
			variant="outline"
			size="medium"
			class="blog__sort-select"
		/> -->
	</div>
	<ul class="blog__articles-grid strip-style">
		{#each articles as article}
			<ArticleCard {article} tag="li" />
		{/each}
	</ul>
	<div class="pagination__wrapper mt-6">
		<Pagination {currentPage} {totalPages} {pageChange} {hasNextPage} {hasPrevPage} />
	</div>
</section>

<style lang="scss">
	.blog__articles-grid {
		display: grid;
		container-name: article-card-wrapper;
		container-type: inline-size;
	}
</style>
