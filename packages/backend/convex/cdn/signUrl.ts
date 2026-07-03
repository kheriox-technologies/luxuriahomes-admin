'use node';

import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { v } from 'convex/values';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

const trailingSlash = /\/$/;
const SIGNED_URL_TTL_MS = 3_600_000;

function buildSignedUrl(s3Key: string): string {
	const baseUrl = process.env.CDN_BASE_URL;
	const keyPairId = process.env.CDN_KEY_PAIR_ID;
	const privateKey = process.env.CDN_PRIVATE_KEY?.replace(/\\n/g, '\n');

	if (!(baseUrl && keyPairId && privateKey)) {
		throw new Error('Missing CDN configuration');
	}

	const url = `${baseUrl.replace(trailingSlash, '')}/${s3Key}`;
	return getSignedUrl({
		url,
		keyPairId,
		privateKey,
		dateLessThan: new Date(Date.now() + SIGNED_URL_TTL_MS).toISOString(),
	});
}

export const signUrl = action({
	args: { s3Key: v.string() },
	returns: v.string(),
	handler: async (ctx, args): Promise<string> => {
		await requireAdmin(ctx);
		return buildSignedUrl(args.s3Key);
	},
});
