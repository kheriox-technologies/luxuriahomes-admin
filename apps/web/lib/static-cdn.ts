import { env } from '@workspace/env/web';

const trailingSlash = /\/$/;
const leadingSlash = /^\//;

/**
 * Builds a permanently-public URL for an object stored in the static bucket.
 * Marketing media is served unsigned via the public static CDN, so the URL is
 * a plain concatenation of the CDN base and the object key.
 */
export function staticCdnUrl(key: string): string {
	const base = env.NEXT_PUBLIC_STATIC_URL.replace(trailingSlash, '');
	return `${base}/${key.replace(leadingSlash, '')}`;
}
