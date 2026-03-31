import type { PageServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
import type { SeoPage } from '$backend/src/payload-types';

export const load: PageServerLoad = async () => {
	const PERMALINK = 'about';

	const page_seo = await payload.find({
		collection: 'seo-pages',
		where: {
			slug: {
				equals: PERMALINK
			}
		},
		limit: 1
	});

	return {
		page_seo: page_seo.docs[0] as SeoPage
	};
};
