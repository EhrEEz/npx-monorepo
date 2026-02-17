import { env } from '$env/dynamic/private';
import { env as env_pub } from '$env/dynamic/public';
import { PayloadSDK } from '@payloadcms/sdk';
import type { Config } from '$backend/src/payload-types';

export const payload = new PayloadSDK<Config>({
	baseURL: `${env_pub.PUBLIC_API_URL}/api`,
	baseInit: {
		headers: {
			Authorization: `users API-Key ${env.PRIVATE_API_KEY}`
		}
	}
});
