import type { PageServerLoad } from './$types';
import { getPayloadClient } from '$lib/payload';
import config from '$lib/config';

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get('page') || '1';
	const sort = url.searchParams.get('sort') || config.blog.sorting;
	const query = url.searchParams.get('query') || '';
	const category = url.searchParams.get('category') || '';

	const payload = await getPayloadClient();
	const result = await payload.find({
		collection: 'articles',
		sort,
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
		articles: result
	};
};
