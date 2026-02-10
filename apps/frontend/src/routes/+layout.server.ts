import type { LayoutServerLoad } from './$types';
import { payload } from '$lib/server/payload-sdk';
export const load: LayoutServerLoad = async ({}) => {
	const result = await payload.findGlobal({
		slug: 'site-settings',
		depth: 2
	});
	console.log(result);

	return {
		siteSettings: result
	};
};
