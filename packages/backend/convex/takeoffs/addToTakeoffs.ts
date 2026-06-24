'use node';

import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { action } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { TAKE_OFFS_FOLDER_PATH } from './shared';

function insertCounter(kebabName: string, counter: number): string {
	const lastDot = kebabName.lastIndexOf('.');
	if (lastDot > 0) {
		return `${kebabName.slice(0, lastDot)}-${counter}${kebabName.slice(lastDot)}`;
	}
	return `${kebabName}-${counter}`;
}

function isPdf(mimeType: string | undefined, kebabName: string): boolean {
	if (mimeType?.includes('pdf')) {
		return true;
	}
	return kebabName.toLowerCase().endsWith('.pdf');
}

const MAX_DEDUPE_ATTEMPTS = 50;

export const addToTakeoffs = action({
	args: {
		documentId: v.id('projectDocuments'),
	},
	returns: v.object({
		takeoffId: v.id('takeoffs'),
		documentId: v.id('projectDocuments'),
	}),
	handler: async (
		ctx,
		args
	): Promise<{
		takeoffId: Id<'takeoffs'>;
		documentId: Id<'projectDocuments'>;
	}> => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const doc = await ctx.runQuery(
			internal.projectDocuments.shared.getDocumentById,
			{ documentId: args.documentId }
		);

		if (!isPdf(doc.mimeType, doc.kebabName)) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'Only PDF documents can be added to take-offs',
			});
		}

		let kebabName = doc.kebabName;
		let attempt = 0;
		while (attempt < MAX_DEDUPE_ATTEMPTS) {
			const exists = await ctx.runQuery(
				internal.projectDocuments.shared.checkDocumentKebabNameExists,
				{
					projectId: doc.projectId,
					folderPath: TAKE_OFFS_FOLDER_PATH,
					kebabName,
				}
			);
			if (!exists) {
				break;
			}
			attempt++;
			kebabName = insertCounter(doc.kebabName, attempt);
		}

		const newS3Key = `projects/${doc.projectId}/documents/${TAKE_OFFS_FOLDER_PATH}/${kebabName}`;

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
				// The copy is overwritten in place by every "Save PDF", so it must not
				// be cached by CloudFront or saves won't be visible on download.
				CacheControl: 'no-cache',
				MetadataDirective: 'REPLACE',
				ContentType: doc.mimeType ?? 'application/pdf',
			})
		);

		return await ctx.runMutation(
			internal.takeoffs.shared.createCopyAndTakeoff,
			{
				projectId: doc.projectId,
				name: doc.name,
				kebabName,
				s3Key: newS3Key,
				size: doc.size,
				mimeType: doc.mimeType,
				uploadedBy: identity.name ?? identity.email ?? 'Unknown',
			}
		);
	},
});
