'use node';

import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { ConvexError, v } from 'convex/values';
import { internal } from '../../_generated/api';
import { action } from '../../_generated/server';
import { checkIdentity } from '../../lib/checkIdentity';

const trailingSlash = /\/$/;
const SIGNED_URL_TTL_MS = 3_600_000;

// Prefix of shared catalogue inclusion images (see fileStorage/generateS3UploadUrl).
const INCLUSION_IMAGE_PREFIX = 'images/inclusions/';

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
 * Signs a CloudFront URL for a client-portal user.
 *
 * The admin `cdn.signUrl` is `requireAdmin`-gated, so clients cannot use it.
 * This variant authorizes the caller as a client of `projectId` and only signs
 * keys the client is legitimately allowed to view: assets under the project's
 * own prefix (documents, note images, generated PDFs) and shared catalogue
 * inclusion images.
 */
export const signUrl = action({
	args: {
		projectId: v.id('projects'),
		s3Key: v.string(),
	},
	returns: v.string(),
	handler: async (ctx, args): Promise<string> => {
		const identity = await checkIdentity(ctx);
		const allowed = await ctx.runQuery(
			internal.clientPortal.internal.isProjectClient,
			{ projectId: args.projectId, portalUserId: identity.subject }
		);
		if (!allowed) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You do not have access to this project',
			});
		}

		const key = args.s3Key.trim();
		const isProjectAsset = key.startsWith(`projects/${args.projectId}/`);
		const isInclusionImage = key.startsWith(INCLUSION_IMAGE_PREFIX);
		if (!(isProjectAsset || isInclusionImage)) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You cannot access this file',
			});
		}

		return buildSignedUrl(key);
	},
});
