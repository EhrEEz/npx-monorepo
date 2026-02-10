import { PayloadSDK } from '@payloadcms/sdk';
import type { Config } from '$backend/src/payload-types'; // Use your existing types
import { PUBLIC_API_URL } from '$env/static/public';
console.log(PUBLIC_API_URL);
export const payload = new PayloadSDK<Config>({
	baseURL: `${PUBLIC_API_URL}/api`
});
