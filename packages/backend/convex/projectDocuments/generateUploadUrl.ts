'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { checkIdentity } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';

function insertCounter(kebabName: string, counter: number): string {
	const lastDot = kebabName.lastIndexOf('.');
	if (lastDot > 0) {
		return `${kebabName.slice(0, lastDot)}-${counter}${kebabName.slice(lastDot)}`;
	}
	return `${kebabName}-${counter}`;
}

export const generateUploadUrl = action({
	args: {
		projectId: v.id('projects'),
		folderPath: v.string(),
		fileName: v.string(),
		contentType: v.string(),
	},
	returns: v.object({
		uploadUrl: v.string(),
		s3Key: v.string(),
		kebabName: v.string(),
	}),
	handler: async (
		ctx,
		args
	): Promise<{ uploadUrl: string; s3Key: string; kebabName: string }> => {
		await checkIdentity(ctx);

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const baseKebabName = toKebabCase(args.fileName);
		let kebabName = baseKebabName;
		let attempt = 0;

		while (attempt < 50) {
			const exists = await ctx.runQuery(
				internal.projectDocuments.shared.checkDocumentKebabNameExists,
				{
					projectId: args.projectId,
					folderPath: args.folderPath,
					kebabName,
				}
			);
			if (!exists) {
				break;
			}
			attempt++;
			kebabName = insertCounter(baseKebabName, attempt);
		}

		const prefix = args.folderPath ? `${args.folderPath}/` : '';
		const s3Key = `projects/${args.projectId}/documents/${prefix}${kebabName}`;

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

		return { uploadUrl, s3Key, kebabName };
	},
});
