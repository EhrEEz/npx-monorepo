import { payload } from '$lib/server/payload-sdk.js';

export const GET = async ({ id }: { id: number }) => {
	try {
		const result = await payload.findByID({
			collection: 'media',
			id: id
		});
		return new Response(JSON.stringify(result));
	} catch (e) {
		console.error(e);
	}
};
