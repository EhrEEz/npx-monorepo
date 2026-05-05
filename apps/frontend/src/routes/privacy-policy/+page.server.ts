import type { PageServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
import { error } from '@sveltejs/kit';
import type { SeoPage, PrivacyPolicy } from '$backend/src/payload-types';

export const load: PageServerLoad = async () => {
	const PERMALINK = 'privacy-policy';

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
			slug: 'privacy-policy'
		});

		return {
			page_seo: (page_seo.docs.length > 0 ? page_seo.docs[0] : null) as SeoPage | null,
			privacy_policy: data as PrivacyPolicy
		};
	} catch (e: unknown) {
		console.log(e);
		if (e && typeof e == 'object' && 'status' in e && 'message' in e) {
			throw error(e.status as number, e.message as string);
		}
		throw error(500, 'Internal Server Error');
	}
};
