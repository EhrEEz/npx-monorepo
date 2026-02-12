import { PRIVATE_API_KEY } from '$env/static/private';
import { PayloadSDK } from '@payloadcms/sdk';
import type { Config } from '$backend/src/payload-types';
import { PUBLIC_API_URL } from '$env/static/public';
export const payload = new PayloadSDK<Config>({
	baseURL: `${PUBLIC_API_URL}/api`,
	baseInit: {
		headers: {
			Authorization: `users API-Key ${PRIVATE_API_KEY}`
		}
	}
});
