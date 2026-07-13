'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

// Returns a presigned S3 PUT URL for a quotation document. Shared by the admin
// `generateUploadUrl` action and the Gmail add-on ingestion path (which
// authenticates via API key instead of Clerk).
export async function presignQuotationUpload(args: {
	projectId: Id<'projects'>;
	contentType: string;
	ext: string;
}): Promise<{ uploadUrl: string; s3Key: string }> {
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucket = process.env.CDN_BUCKET_NAME;

	if (!(region && accessKeyId && secretAccessKey && bucket)) {
		throw new Error('Missing AWS configuration');
	}

	const s3Key = `projects/${args.projectId}/quotations/${crypto.randomUUID()}.${args.ext}`;

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
		{ expiresIn: 300 }
	);

	return { uploadUrl, s3Key };
}

export const generateUploadUrl = action({
	args: {
		projectId: v.id('projects'),
		contentType: v.string(),
		ext: v.string(),
	},
	returns: v.object({ uploadUrl: v.string(), s3Key: v.string() }),
	handler: async (ctx, args): Promise<{ uploadUrl: string; s3Key: string }> => {
		await requireAdmin(ctx);
		return await presignQuotationUpload(args);
	},
});
