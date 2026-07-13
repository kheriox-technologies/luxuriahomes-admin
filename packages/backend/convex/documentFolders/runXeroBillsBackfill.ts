'use node';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { internal } from '../_generated/api';
import { internalAction } from '../_generated/server';

/**
 * One-off backfill: moves the Xero bill-forwarding trigger from the root "Bills"
 * folder to the nested "Xero/Bills" folder.
 *
 * 1. Ensures the global "Xero" template exists and removes the global "Bills"
 *    template, then seeds "Xero" and "Xero/Bills" into every existing project.
 * 2. Deletes the old root "Bills" folder (and any nested subfolders) along with
 *    all documents inside it — removing both their S3 objects and DB records.
 *
 * Idempotent — re-running seeds nothing new and finds no remaining "bills"
 * documents/folders to delete. Invoke via the Convex dashboard/CLI after
 * deploying:
 *   npx convex run documentFolders/runXeroBillsBackfill:runXeroBillsBackfill
 */
export const runXeroBillsBackfill = internalAction({
	args: {},
	handler: async (
		ctx
	): Promise<{
		projects: number;
		deletedDocuments: number;
		deletedFolders: number;
	}> => {
		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const { projects } = await ctx.runMutation(
			internal.documentFolders.backfillXeroBillsFolder.seedProjectsForXeroBills,
			{}
		);

		const { documents, folderIds } = await ctx.runQuery(
			internal.documentFolders.backfillXeroBillsFolder
				.getOldBillsCleanupTargets,
			{}
		);

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		for (const doc of documents) {
			await client.send(
				new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3Key })
			);
			await ctx.runMutation(
				internal.projectDocuments.shared.deleteDocumentRecord,
				{ documentId: doc.documentId }
			);
		}

		for (const folderId of folderIds) {
			await ctx.runMutation(
				internal.projectDocuments.shared.deleteFolderRecord,
				{
					folderId,
				}
			);
		}

		return {
			projects,
			deletedDocuments: documents.length,
			deletedFolders: folderIds.length,
		};
	},
});
