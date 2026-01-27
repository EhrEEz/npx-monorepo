import type { PageServerLoad } from './$types';
import { getPayloadClient } from '$lib/payload';
import config from '$lib/config';

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
	const page = url.searchParams.get('page') || '1';
	let sort = url.searchParams.get('sort') || config.blog.sorting;
	const query = url.searchParams.get('query') || '';
	const category = url.searchParams.get('category') || '';

	const payload = await getPayloadClient();

	let sort_search_res = SERVER_SORT_CODES.find((emt) => {
		return emt.client === sort;
	});
	if (sort_search_res === undefined) {
		sort_search_res = SERVER_SORT_CODES.find((emt) => {
			return emt.client === config.blog.sorting;
		});

		sort = config.blog.sorting;
	}

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
			where: {
				'category.name': category ? { equals: category, contains: query } : undefined,
				title: query ? { contains: query } : undefined,
				'tags.name': query ? { contains: query } : undefined
			},
			tags: true,
			category: true
		},
		pagination: {
			limit: config.blog.articlesPerPage
		},
		page: page
	});

	return {
		articles: result,
		sorting_mode: sort
	};
};
