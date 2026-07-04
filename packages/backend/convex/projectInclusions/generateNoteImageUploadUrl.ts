'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

const leadingDot = /^\./;
const UPLOAD_URL_TTL_SECONDS = 300;

export const generateNoteImageUploadUrl = action({
	args: {
		projectId: v.id('projects'),
		contentType: v.string(),
		ext: v.string(),
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

		const ext = args.ext.replace(leadingDot, '').toLowerCase();
		const s3Key = `projects/${args.projectId}/inclusion-notes/${crypto.randomUUID()}.${ext}`;

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
				Key: s3Key,
				ContentType: args.contentType,
			}),
			{ expiresIn: UPLOAD_URL_TTL_SECONDS }
		);

		return { uploadUrl, s3Key };
	},
});
