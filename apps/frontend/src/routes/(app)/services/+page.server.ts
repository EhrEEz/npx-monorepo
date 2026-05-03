import type { PageServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
import type { SeoPage, Service } from '$backend/src/payload-types';

export const load: PageServerLoad = async () => {
	const PERMALINK = 'services';

	const page_seo = await payload
		.find({
			collection: 'seo-pages',
			where: {
				slug: {
					equals: PERMALINK
				}
			},
			limit: 1
		})
		.catch((error) => {
			console.error('Error fetching SEO page:', error);
			return { docs: [] };
		});

	const page_data = await payload
		.find({
			collection: 'service',
			select: {
				id: true,
				name: true,
				slug: true,
				label: true,
				cover: true,
				images: true,
				relatedInners: {
					name: true,
					label: true,
					id: true
				},
				description: true
			}
		})
		.catch((error) => {
			console.error('Error fetching Services:', error);
			return { docs: [] };
		});
	return {
		services: (page_data.docs.length > 0 ? page_data.docs : null) as Service[] | null,
		page_seo: (page_seo.docs.length > 0 ? page_seo.docs[0] : null) as SeoPage | null
	};
};
