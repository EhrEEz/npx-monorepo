import type { PageServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
import config from '$lib/config';
import type { SeoPage } from '$backend/src/payload-types';

const SERVER_SORT_CODES = [
	{
		client: 'latest',
		server: '-createdAt'
	},
	{
		client: 'oldest',
		server: 'createdAt'
	},
	{
		client: 'alpha-asc',
		server: 'title'
	},
	{
		client: 'alpha-desc',
		server: '-title'
	}
];

export const load: PageServerLoad = async ({ url }) => {
	const PERMALINK = 'blog';

	const page = parseInt(url.searchParams.get('page') as string) || 1;
	let sort = url.searchParams.get('sort') || config.blog.sorting;
	const query = url.searchParams.get('query') || '';
	const category = url.searchParams.get('category') || '';

	let sort_search_res = SERVER_SORT_CODES.find((emt) => {
		return emt.client === sort;
	});
	if (sort_search_res === undefined) {
		sort_search_res = SERVER_SORT_CODES.find((emt) => {
			return emt.client === config.blog.sorting;
		});

		sort = config.blog.sorting;
	}
	const whereClause = {
		and: [
			{ _status: { equals: 'published' } },

			// 1. Mandatory Category Filter
			...(category && category !== '' ? [{ 'category.slug': { equals: category } }] : []),

			// 2. Search Query Filter
			...(query
				? [
						{
							or: [{ title: { contains: query } }, { 'tags.tag': { contains: query } }]
						}
					]
				: [])
		]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
	const result = await payload.find({
		collection: 'articles',
		sort: sort_search_res!.server,
		select: {
			title: true,
			slug: true,
			createdAt: true,
			cover_image: {
				url: true,
				alt: true,
				sizes: {
					thumbnail: true
				}
			},
			tags: true,
			category: true
		},
		where: whereClause,
		limit: config.blog.articlesPerPage,
		page: page
	}).catch((error) => {
		console.error('Error fetching articles:', error);
		return { docs: [], totalDocs: 0, hasNextPage: false, hasPrevPage: false, page: 1, totalPages: 0 };
	});

	const categories = await payload.find({
		collection: 'categories'
	}).catch((error) => {
		console.error('Error fetching categories:', error);
		return { docs: [], totalDocs: 0 };
	});

	const page_seo = await payload.find({
		collection: 'seo-pages',
		where: {
			slug: {
				equals: PERMALINK
			}
		},
		limit: 1
	}).catch((error) => {
		console.error('Error fetching SEO page:', error);
		return { docs: [] };
	});

	return {
		page_seo: (page_seo.docs[0] || null) as SeoPage | null,
		categories: categories.docs || [],
		articles: result,
		sorting_mode: sort,
		query,
		category
	};
};
