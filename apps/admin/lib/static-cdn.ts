import { env } from '@workspace/env/admin';

const trailingSlash = /\/$/;
const leadingSlash = /^\//;

/**
 * Builds a permanently-public URL for an object stored in the static bucket.
 * These objects are served unsigned via the public static CDN, so the URL is a
 * plain concatenation of the CDN base and the object key — safe to embed on the
 * public website.
 */
export function staticCdnUrl(key: string): string {
	const base = env.NEXT_PUBLIC_STATIC_URL.replace(trailingSlash, '');
	return `${base}/${key.replace(leadingSlash, '')}`;
}
