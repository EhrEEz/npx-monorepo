<script lang="ts">
	import type { Article } from '$backend/src/payload-types';
	import '$lib/scss/pages/_blogs.scss';
	import Share from '$lib/components/Share/Share.svelte';
	import Tag from '$lib/components/Tag/Tag.svelte';
	import moment from 'moment';
	import { marked, type RendererObject } from 'marked';
	import DOMPurify from 'dompurify';

	const customRenderer: RendererObject = {
		heading({ tokens, depth }): string {
			const text = this.parser.parseInline(tokens);
			return `<h${depth === 1 ? 2 : depth} class="content-heading heading-${depth === 6 ? 6 : depth + 1}">${text}</h${depth === 1 ? 2 : depth}>`;
		},
		link({ tokens, href, title }): string {
			const text = this.parser.parseInline(tokens);
			return `<a href="${href}" title="${title ? title : href}" target="_blank" class="content-link">${text}</a>`;
		},

		paragraph({ tokens }): string {
			const text = this.parser.parseInline(tokens);
			if (text.startsWith('<img')) {
				return `<p class="content-image">${text}</p>`;
			}
			return `<p class="content-element">${text}</p>`;
		},
		code({ text, lang }): string {
			return `<pre class="content-code"><code${lang ? ` class="language-${lang}"` : ''}>${text}</code></pre>`;
		},
		blockquote({ tokens }): string {
			const text = this.parser.parse(tokens);
			return `<blockquote class="content-blockquote">${text}</blockquote>`;
		},
		table({ header, rows }): string {
			const headerHTML = header
				.map((cell) => {
					return `<th class="content-table-cell content-table-head-cell">${this.parser.parseInline(cell.tokens)}</th>`;
				})
				.join('');

			const bodyHTML = rows
				.map((row) => {
					const rowHTML = row
						.map((cell) => {
							return `<td class="content-table-cell">${this.parser.parseInline(cell.tokens)}</td>`;
						})
						.join('');
					return `<tr class="content-table-row">${rowHTML}</tr>`;
				})
				.join('');
			return `<table class="content-table"><thead class="content-table-head"><tr class="content-table-row">${headerHTML}</tr></thead><tbody class="content-table-body">${bodyHTML}</tbody></table>
			</tbody></table>`;
		},

		codespan({ text }): string {
			return `<code class="content-inline-code">${text}</code>`;
		},

		image({ href, title, text }): string {
			return `<img src="${href}" alt="${text}" title="${title || ''}" class="content-element" />`;
		},

		list({ items, ordered }): string {
			const tag = ordered ? 'ol' : 'ul';
			const className = ordered ? 'content-ordered-list' : 'content-unordered-list';
			const itemText = items
				.map((item) => {
					return `<li class="content-list-item">${this.parser.parse(item.tokens)}</li>`;
				})
				.join('');
			return `<${tag} class="content-list ${className}">${itemText}</${tag}>`;
		}
	};

	marked.use({ renderer: customRenderer });

	const { data }: { data: { data: Article } } = $props();
	const mainData = $derived(data.data);
	const created_on = $derived.by(() => {
		return moment(mainData.createdAt).format('MMM DD, YYYY');
	});

	let purified_html = $state<string>('');
	$effect(() => {
		const dirty = marked.parse(mainData.text) as string;
		purified_html = DOMPurify.sanitize(dirty);
	});
</script>

<!-- <Seo {media_url} siteSettings={{}} pageSettings={{}} /> -->
<section class="article__section content-grid py-4 py-md-6 py-lg-9">
	<div class="mb-5">
		<a href="/blog" class="link" aria-label="Back to Articles">
			<span class="btn__wrapper">
				<span class="btn__icon"
					><svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 7H15C16.3261 7 17.5979 7.52678 18.5355 8.46447C19.4732 9.40215 20 10.6739 20 12C20 13.3261 19.4732 14.5979 18.5355 15.5355C17.5979 16.4732 16.3261 17 15 17M4 7L7 4M4 7L7 10M8 17H11"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span><span class="btn__text">Back to Articles </span></span
			>
		</a>
	</div>
	<article id={`article-` + mainData.slug + '_'}>
		<div class="fl-row al-center gap-1 mb-3">
			<Tag variant="outline" color="accent" size="small">{created_on}</Tag>
			<!-- <span class="neutral-500">|</span> -->
			<Tag color="white" size="small">{mainData.category}</Tag>
		</div>
		<h1 class="heading-1 mb-4">{mainData.title}</h1>
		{#if mainData.cover_image}
			<img class="rounded-image" src={mainData.cover_image.uri} alt={mainData.cover_image.alt} />
		{/if}
		{#if mainData.tags.length > 0}
			<div class="fl-row gap-1 my-3">
				{#each mainData.tags as tag}
					<Tag variant="outline" color="light" size="small" curvature="large">{tag}</Tag>
				{/each}
			</div>
		{/if}
		<div class="grid-row jc-between ai-center mt-7 mb-7">
			<div class="col-4">
				<Share
					title={mainData.title}
					cover_image={mainData.cover_image.uri}
					addresses={['facebook', 'x', 'linkedin', 'pinterest', 'threads']}
				/>
			</div>
			<div class="col-8">
				<p class="regular-48">{mainData.short_quote}</p>
			</div>
		</div>
		<div class="article-content">
			{@html purified_html}
		</div>
	</article>
</section>
<section class="additional__section py-4 py-md-6 py-lg-8 full-width content-grid">
	<div class="grid-row">
		<div class="col-lg-4">
			<h2 class="heading-2 mb-2 mb-md-3 mb-lg-4">Thank you for reading the article.</h2>
			<Share
				title={mainData.title}
				cover_image={mainData.cover_image.uri}
				addresses={['facebook', 'x', 'linkedin', 'pinterest', 'threads']}
				>{#snippet share_label()}Share this article{/snippet}</Share
			>
		</div>
		<div class="additional__wrapper col-start-lg-6 col-end-lg-13">
			<div class="mb-3 mb-md-4">
				<a href="/blog" class="link" aria-label="Back to Articles">
					<span class="btn__wrapper">
						<span class="btn__icon"
							><svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M4 7H15C16.3261 7 17.5979 7.52678 18.5355 8.46447C19.4732 9.40215 20 10.6739 20 12C20 13.3261 19.4732 14.5979 18.5355 15.5355C17.5979 16.4732 16.3261 17 15 17M4 7L7 4M4 7L7 10M8 17H11"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span><span class="btn__text">Back to Articles </span></span
					>
				</a>
			</div>
			<ul class="strip-style" aria-label="Additional Articles">
				<li></li>
			</ul>
		</div>
	</div>
</section>
