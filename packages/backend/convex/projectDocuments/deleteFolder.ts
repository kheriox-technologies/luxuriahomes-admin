'use node';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { checkIdentity } from '../lib/checkIdentity';

export const deleteFolder = action({
	args: {
		folderId: v.id('projectDocumentFolders'),
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

		const folder = await ctx.runQuery(
			internal.projectDocuments.shared.getFolderById,
			{ folderId: args.folderId }
		);

		const allDocuments = await ctx.runQuery(
			internal.projectDocuments.shared.getAllDocumentsForProject,
			{ projectId: folder.projectId }
		);
		const allFolders = await ctx.runQuery(
			internal.projectDocuments.shared.getAllFoldersForProject,
			{ projectId: folder.projectId }
		);

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		// Delete all documents under this folder (and subfolders)
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
				internal.projectDocuments.shared.deleteDocumentRecord,
				{
					documentId: doc._id,
				}
			);
		}

		// Delete all subfolders
		for (const f of allFolders) {
			const isAffected =
				f.path === folder.path || f.path.startsWith(`${folder.path}/`);
			if (!isAffected) {
				continue;
			}

			await ctx.runMutation(
				internal.projectDocuments.shared.deleteFolderRecord,
				{
					folderId: f._id,
				}
			);
		}
	},
});
