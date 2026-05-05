import type { PageServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
import { error } from '@sveltejs/kit';
import type { SeoPage, TermsOfService } from '$backend/src/payload-types';

export const load: PageServerLoad = async () => {
	const PERMALINK = 'terms-of-service';

	try {
		const page_seo = await payload.find({
			collection: 'seo-pages',
			where: {
				slug: {
					equals: PERMALINK
				}
			},
			limit: 1
		});

		const data = await payload.findGlobal({
			slug: 'terms-of-service'
		});

		return {
			page_seo: (page_seo.docs.length > 0 ? page_seo.docs[0] : null) as SeoPage | null,
			terms_of_service: data as TermsOfService
		};
	} catch (e: unknown) {
		console.log(e);
		if (e && typeof e == 'object' && 'status' in e && 'message' in e) {
			throw error(e.status as number, e.message as string);
		}
		throw error(500, 'Internal Server Error');
	}
};
