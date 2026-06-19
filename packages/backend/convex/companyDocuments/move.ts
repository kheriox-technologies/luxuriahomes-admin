'use node';

import {
	CopyObjectCommand,
	DeleteObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

function insertCounter(kebabName: string, counter: number): string {
	const lastDot = kebabName.lastIndexOf('.');
	if (lastDot > 0) {
		return `${kebabName.slice(0, lastDot)}-${counter}${kebabName.slice(lastDot)}`;
	}
	return `${kebabName}-${counter}`;
}

export const move = action({
	args: {
		documentId: v.id('companyDocuments'),
		targetFolderPath: v.string(),
	},
	handler: async (ctx, args): Promise<void> => {
		await requireAdmin(ctx);

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const doc = await ctx.runQuery(
			internal.companyDocuments.shared.getDocumentById,
			{ documentId: args.documentId }
		);

		if (doc.folderPath === args.targetFolderPath) {
			return;
		}

		let kebabName = doc.kebabName;
		let attempt = 0;

		while (attempt < 50) {
			const exists = await ctx.runQuery(
				internal.companyDocuments.shared.checkDocumentKebabNameExists,
				{
					folderPath: args.targetFolderPath,
					kebabName,
				}
			);
			if (!exists) {
				break;
			}
			attempt++;
			kebabName = insertCounter(doc.kebabName, attempt);
		}

		const prefix = args.targetFolderPath ? `${args.targetFolderPath}/` : '';
		const newS3Key = `company/documents/${prefix}${kebabName}`;

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

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

		await ctx.runMutation(
			internal.companyDocuments.shared.updateDocumentRecord,
			{
				documentId: args.documentId,
				name: doc.name,
				kebabName,
				s3Key: newS3Key,
				folderPath: args.targetFolderPath,
			}
		);
	},
});
