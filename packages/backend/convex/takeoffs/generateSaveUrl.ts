'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

// Presigned PUT for the takeoff's existing S3 key so the annotated PDF
// overwrites the copy in the Take Offs folder in place.
export const generateSaveUrl = action({
	args: {
		takeoffId: v.id('takeoffs'),
	},
	returns: v.object({ uploadUrl: v.string(), s3Key: v.string() }),
	handler: async (ctx, args): Promise<{ uploadUrl: string; s3Key: string }> => {
		await requireAdmin(ctx);

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const takeoff = await ctx.runQuery(
			internal.takeoffs.shared.getTakeoffById,
			{
				takeoffId: args.takeoffId,
			}
		);

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		const uploadUrl = await getSignedUrl(
			client,
			new PutObjectCommand({
				Bucket: bucket,
				Key: takeoff.s3Key,
				ContentType: 'application/pdf',
			}),
			{ expiresIn: 300 }
		);

		return { uploadUrl, s3Key: takeoff.s3Key };
	},
});
