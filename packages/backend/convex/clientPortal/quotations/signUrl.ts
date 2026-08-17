'use node';

import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { ConvexError, v } from 'convex/values';
import { internal } from '../../_generated/api';
import { action } from '../../_generated/server';

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

/**
 * Signs a CloudFront URL for a quotation PDF.
 *
 * The admin `cdn.signUrl` is `requireAdmin`-gated, and quotation PDFs are filed
 * under the shared Client Quotations folder rather than a `projects/{id}/`
 * prefix, so neither of the existing signers covers this case. Authorization is
 * by allow-list: the key must be the quotation's own PDF or one issued for a
 * version of it, and the caller must be a client on that quotation.
 */
export const signUrl = action({
	args: {
		quotationId: v.id('clientQuotations'),
		s3Key: v.string(),
	},
	returns: v.string(),
	handler: async (ctx, args): Promise<string> => {
		const allowed = await ctx.runQuery(
			internal.clientPortal.quotations.internal.listSignableKeys,
			{ quotationId: args.quotationId }
		);

		const key = args.s3Key.trim();
		if (!allowed.includes(key)) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You cannot access this file',
			});
		}

		return buildSignedUrl(key);
	},
});
