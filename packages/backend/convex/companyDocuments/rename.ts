'use node';

import {
	CopyObjectCommand,
	DeleteObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { ConvexError, v } from 'convex/values';
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

function buildS3Client(
	region: string,
	accessKeyId: string,
	secretAccessKey: string
): S3Client {
	return new S3Client({
		region,
		credentials: { accessKeyId, secretAccessKey },
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED',
	});
}

export const rename = action({
	args: {
		documentId: v.id('companyDocuments'),
		newName: v.string(),
	},
	handler: async (ctx, args): Promise<void> => {
		await checkIdentity(ctx);

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const trimmedName = args.newName.trim();
		if (!trimmedName) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'Name is required',
			});
		}

		const doc = await ctx.runQuery(
			internal.companyDocuments.shared.getDocumentById,
			{ documentId: args.documentId }
		);

		const baseKebabName = toKebabCase(trimmedName);
		let kebabName = baseKebabName;
		let attempt = 0;

		while (attempt < 50) {
			const exists = await ctx.runQuery(
				internal.companyDocuments.shared.checkDocumentKebabNameExists,
				{
					folderPath: doc.folderPath,
					kebabName,
					excludeDocumentId: args.documentId,
				}
			);
			if (!exists) {
				break;
			}
			attempt++;
			kebabName = insertCounter(baseKebabName, attempt);
		}

		const prefix = doc.folderPath ? `${doc.folderPath}/` : '';
		const newS3Key = `company/documents/${prefix}${kebabName}`;

		if (newS3Key !== doc.s3Key) {
			const client = buildS3Client(region, accessKeyId, secretAccessKey);
			await client.send(
				new CopyObjectCommand({
					Bucket: bucket,
					CopySource: `${bucket}/${doc.s3Key}`,
					Key: newS3Key,
				})
			);
			await client.send(
				new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3Key })
			);
		}

		await ctx.runMutation(
			internal.companyDocuments.shared.updateDocumentRecord,
			{
				documentId: args.documentId,
				name: trimmedName,
				kebabName,
				s3Key: newS3Key,
				folderPath: doc.folderPath,
			}
		);
	},
});
