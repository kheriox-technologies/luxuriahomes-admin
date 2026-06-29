'use node';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const deleteMedia = action({
	args: {
		websiteProjectId: v.id('websiteProjects'),
		key: v.string(),
	},
	handler: async (ctx, args): Promise<{ key: string }> => {
		await requireAdmin(ctx);

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
			new DeleteObjectCommand({ Bucket: bucket, Key: args.key })
		);

		await ctx.runMutation(
			internal.websiteProjects.removeMediaEntry.removeMediaEntry,
			{
				websiteProjectId: args.websiteProjectId,
				key: args.key,
			}
		);

		return { key: args.key };
	},
});
