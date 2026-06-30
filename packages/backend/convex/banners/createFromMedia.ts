'use node';

import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

const extPattern = /\.([a-z0-9]+)$/i;

/**
 * Promotes an existing project image to a marketing banner. The source object
 * already lives in the static bucket, so we copy it (same bucket) into the
 * `banners/` prefix and persist a banner record pointing at the copy. This
 * decouples the banner from the source project media.
 */
export const createFromMedia = action({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		sourceKey: v.string(),
	},
	handler: async (ctx, args): Promise<Id<'banners'>> => {
		await requireAdmin(ctx);

		const title = args.title.trim();
		if (title === '') {
			throw new ConvexError({
				code: 'TITLE_REQUIRED',
				message: 'Banner title is required',
			});
		}

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.STATIC_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing static bucket configuration');
		}

		const ext = extPattern.exec(args.sourceKey)?.[1]?.toLowerCase() ?? 'jpg';
		const destKey = `banners/${crypto.randomUUID()}.${ext}`;

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		await client.send(
			new CopyObjectCommand({
				Bucket: bucket,
				CopySource: `${bucket}/${args.sourceKey}`,
				Key: destKey,
			})
		);

		const description = args.description?.trim() || undefined;

		return await ctx.runMutation(internal.banners.insert.insert, {
			title,
			description,
			key: destKey,
		});
	},
});
