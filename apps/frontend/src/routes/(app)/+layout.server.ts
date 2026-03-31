import type { LayoutServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
import { error } from '@sveltejs/kit';
export const load: LayoutServerLoad = async () => {
	try {
		const result = await payload.findGlobal({
			slug: 'site-settings',
			depth: 2
		});
		return {
			siteSettings: result
		};
	} catch (e: unknown) {
		console.log(e);
		if (e && typeof e == 'object' && 'status' in e && 'message' in e) {
			throw error(e.status as number, e.message as string);
		}
		throw error(500, 'Internal Server Error');
	}
};
