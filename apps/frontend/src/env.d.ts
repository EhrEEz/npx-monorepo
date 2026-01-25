declare module '$env/static/private' {
	export const DATABASE_URI: string;
	export const PAYLOAD_SECRET: string;
}

declare module '$env/static/public' {
	export const PUBLIC_API_URL: string;
}
