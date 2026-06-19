'use node';

import {
	CopyObjectCommand,
	DeleteObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

function replacePathPrefix(
	path: string,
	oldPrefix: string,
	newPrefix: string
): string {
	if (path === oldPrefix) {
		return newPrefix;
	}
	if (path.startsWith(`${oldPrefix}/`)) {
		return `${newPrefix}${path.slice(oldPrefix.length)}`;
	}
	return path;
}

export const renameFolder = action({
	args: {
		folderId: v.id('projectDocumentFolders'),
		newName: v.string(),
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

		const trimmedName = args.newName.trim();
		if (!trimmedName) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'Folder name is required',
			});
		}

		const folder = await ctx.runQuery(
			internal.projectDocuments.shared.getFolderById,
			{ folderId: args.folderId }
		);

		const slugName =
			toKebabCase(trimmedName).replace(fileExtensionPattern, '') || 'folder';
		const newPath = folder.parentPath
			? `${folder.parentPath}/${slugName}`
			: slugName;

		if (newPath === folder.path) {
			// Only display name changed, no path change needed
			await ctx.runMutation(
				internal.projectDocuments.shared.updateFolderRecord,
				{
					folderId: args.folderId,
					name: trimmedName,
					path: folder.path,
					parentPath: folder.parentPath,
				}
			);
			return;
		}

		const allFolders = await ctx.runQuery(
			internal.projectDocuments.shared.getAllFoldersForProject,
			{ projectId: folder.projectId }
		);

		const conflicting = allFolders.find(
			(f) => f.path === newPath && f._id !== args.folderId
		);
		if (conflicting) {
			throw new ConvexError({
				code: 'CONFLICT',
				message: 'A folder with this name already exists here',
			});
		}

		const allDocuments = await ctx.runQuery(
			internal.projectDocuments.shared.getAllDocumentsForProject,
			{ projectId: folder.projectId }
		);

		const client = new S3Client({
			region,
			credentials: { accessKeyId, secretAccessKey },
			requestChecksumCalculation: 'WHEN_REQUIRED',
			responseChecksumValidation: 'WHEN_REQUIRED',
		});

		// Move all documents whose folderPath is under the old folder path
		const docUpdates: Array<{
			documentId: Id<'projectDocuments'>;
			folderPath: string;
			s3Key: string;
		}> = [];

		for (const doc of allDocuments) {
			const isAffected =
				doc.folderPath === folder.path ||
				doc.folderPath.startsWith(`${folder.path}/`);

			if (!isAffected) {
				continue;
			}

			const newFolderPath = replacePathPrefix(
				doc.folderPath,
				folder.path,
				newPath
			);
			const prefix = newFolderPath ? `${newFolderPath}/` : '';
			const newS3Key = `projects/${doc.projectId}/documents/${prefix}${doc.kebabName}`;

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

			docUpdates.push({
				documentId: doc._id,
				folderPath: newFolderPath,
				s3Key: newS3Key,
			});
		}

		if (docUpdates.length > 0) {
			await ctx.runMutation(
				internal.projectDocuments.shared.batchUpdateDocumentFolderPath,
				{ updates: docUpdates }
			);
		}

		// Update subfolders whose path is under the old folder path
		for (const f of allFolders) {
			if (f._id === args.folderId) {
				continue;
			}
			const isAffected =
				f.path === folder.path || f.path.startsWith(`${folder.path}/`);
			if (!isAffected) {
				continue;
			}

			const updatedPath = replacePathPrefix(f.path, folder.path, newPath);
			const updatedParentPath = replacePathPrefix(
				f.parentPath,
				folder.path,
				newPath
			);

			await ctx.runMutation(
				internal.projectDocuments.shared.updateFolderRecord,
				{
					folderId: f._id,
					name: f.name,
					path: updatedPath,
					parentPath: updatedParentPath,
				}
			);
		}

		// Update the renamed folder itself
		await ctx.runMutation(internal.projectDocuments.shared.updateFolderRecord, {
			folderId: args.folderId,
			name: trimmedName,
			path: newPath,
			parentPath: folder.parentPath,
		});
	},
});
