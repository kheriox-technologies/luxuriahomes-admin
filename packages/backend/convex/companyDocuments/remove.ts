'use node';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = action({
	args: {
		documentId: v.id('companyDocuments'),
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

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		await client.send(
			new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3Key })
		);

		await ctx.runMutation(
			internal.companyDocuments.shared.deleteDocumentRecord,
			{
				documentId: args.documentId,
			}
		);
	},
});
