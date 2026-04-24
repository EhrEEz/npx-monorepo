import { payload } from '$lib/server/payload-sdk';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data = await payload.find({
		collection: 'service',
		where: {
			slug: {
				equals: params.slug
			}
		},
		pagination: true
	});
	if (data.totalDocs <= 0) {
		error(404, {
			message: 'Page not found'
		});
	}

	return { service: data.docs[0] };
};
