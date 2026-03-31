import { payload } from '$lib/server/payload-sdk';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data = await payload.find({
		collection: 'articles',
		where: {
			slug: {
				equals: params.slug
			}
		},
		pagination: true
	});

	const recommended_articles = await payload.find({
		collection: 'articles',
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
		where: {
			and: [
				{ _status: { equals: 'published' } },
				{
					slug: {
						not_equals: params.slug
					}
				}
			]
		},

		limit: 4,
		page: 1,

		sort: '-createdAt'
	});

	return { article: data.docs[0], recommended_articles: recommended_articles.docs };
};
