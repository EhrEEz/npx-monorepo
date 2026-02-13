import { env } from '$env/dynamic/public';

export default {
	uri: env.PUBLIC_API_URL,
	blog: {
		articlesPerPage: 10,
		sorting: 'latest'
	}
};
