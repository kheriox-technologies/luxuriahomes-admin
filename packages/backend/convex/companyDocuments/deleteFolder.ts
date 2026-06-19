'use node';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const deleteFolder = action({
	args: {
		folderId: v.id('companyDocumentFolders'),
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

		const folder = await ctx.runQuery(
			internal.companyDocuments.shared.getFolderById,
			{ folderId: args.folderId }
		);

		const allDocuments = await ctx.runQuery(
			internal.companyDocuments.shared.getAllDocuments,
			{}
		);
		const allFolders = await ctx.runQuery(
			internal.companyDocuments.shared.getAllFolders,
			{}
		);

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		for (const doc of allDocuments) {
			const isAffected =
				doc.folderPath === folder.path ||
				doc.folderPath.startsWith(`${folder.path}/`);
			if (!isAffected) {
				continue;
			}

			await client.send(
				new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3Key })
			);
			await ctx.runMutation(
				internal.companyDocuments.shared.deleteDocumentRecord,
				{
					documentId: doc._id,
				}
			);
		}

		for (const f of allFolders) {
			const isAffected =
				f.path === folder.path || f.path.startsWith(`${folder.path}/`);
			if (!isAffected) {
				continue;
			}

			await ctx.runMutation(
				internal.companyDocuments.shared.deleteFolderRecord,
				{
					folderId: f._id,
				}
			);
		}
	},
});
