'use node';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = action({
	args: {
		bannerId: v.id('banners'),
	},
	handler: async (ctx, args): Promise<{ bannerId: typeof args.bannerId }> => {
		await requireAdmin(ctx);

		const banner = await ctx.runQuery(internal.banners.get.get, {
			bannerId: args.bannerId,
		});
		if (!banner) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Banner not found',
			});
		}

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.STATIC_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing static bucket configuration');
		}

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		await client.send(
			new DeleteObjectCommand({ Bucket: bucket, Key: banner.key })
		);

		await ctx.runMutation(internal.banners.removeRecord.removeRecord, {
			bannerId: args.bannerId,
		});

		return { bannerId: args.bannerId };
	},
});
