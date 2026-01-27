import config from '$lib/config';
import { getPayloadClient } from '$lib/payload.js';

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

export const GET = async ({ url }) => {
	const page = url.searchParams.get('page') || '1';
	const sort = url.searchParams.get('sort') || config.blog.sorting;
	const query = url.searchParams.get('query') || '';
	const category = url.searchParams.get('category') || '';

	let sort_search_res = SERVER_SORT_CODES.find((emt) => {
		return emt.client === sort;
	});
	if (sort_search_res === undefined) {
		sort_search_res = SERVER_SORT_CODES.find((emt) => {
			return emt.client === config.blog.sorting;
		});
	}

	const payload = await getPayloadClient();
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

	return new Response(JSON.stringify(result));
};
