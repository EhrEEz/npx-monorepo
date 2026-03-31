import config from '$lib/config';
import { payload } from '$lib/server/payload-sdk.js';

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
	const page = parseInt(url.searchParams.get('page') as string) || 1;
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
	});

	return new Response(JSON.stringify(result));
};
