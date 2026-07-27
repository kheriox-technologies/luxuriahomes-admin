'use node';

// Composes a letter into a branded-letterhead PDF entirely server-side, uploads
// it to the CDN bucket, and records it as a company/project document (with the
// source `letterContentHtml` so it stays re-composable in the portal). This is
// the mobile counterpart to the portal's browser pipeline: the RN app cannot run
// pdfmake/pdf-lib, so the whole generate → upload → insert flow lives here in one
// action, mirroring `projectOrders/generatePdf.ts` for S3/CloudFront handling.

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { type ActionCtx, action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';
import { buildLetterPdfBuffer } from './pdf/composite';

const trailingSlash = /\/$/;
const SIGNED_URL_TTL_MS = 3_600_000;
const PDF_CONTENT_TYPE = 'application/pdf';
const MAX_DEDUP_ATTEMPTS = 50;

function insertCounter(kebabName: string, counter: number): string {
	const lastDot = kebabName.lastIndexOf('.');
	if (lastDot > 0) {
		return `${kebabName.slice(0, lastDot)}-${counter}${kebabName.slice(lastDot)}`;
	}
	return `${kebabName}-${counter}`;
}

function buildSignedUrl(s3Key: string): string {
	const baseUrl = process.env.CDN_BASE_URL;
	const keyPairId = process.env.CDN_KEY_PAIR_ID;
	const privateKey = process.env.CDN_PRIVATE_KEY?.replace(/\\n/g, '\n');
	if (!(baseUrl && keyPairId && privateKey)) {
		throw new Error('Missing CDN configuration');
	}
	const url = `${baseUrl.replace(trailingSlash, '')}/${s3Key}`;
	return getSignedUrl({
		url,
		keyPairId,
		privateKey,
		dateLessThan: new Date(Date.now() + SIGNED_URL_TTL_MS).toISOString(),
	});
}

// Dedupes the kebab filename within the target folder and returns the final
// kebab name + S3 key, using the exact key convention of the documents
// `generateUploadUrl` actions so the stored letter opens through `cdn.signUrl`.
async function resolveDocumentKey(
	ctx: ActionCtx,
	args: {
		fileName: string;
		folderPath: string;
		projectId?: Id<'projects'>;
	}
): Promise<{ kebabName: string; s3Key: string }> {
	const baseKebabName = toKebabCase(args.fileName);
	let kebabName = baseKebabName;
	let attempt = 0;

	while (attempt < MAX_DEDUP_ATTEMPTS) {
		const exists = args.projectId
			? await ctx.runQuery(
					internal.projectDocuments.shared.checkDocumentKebabNameExists,
					{
						projectId: args.projectId,
						folderPath: args.folderPath,
						kebabName,
					}
				)
			: await ctx.runQuery(
					internal.companyDocuments.shared.checkDocumentKebabNameExists,
					{ folderPath: args.folderPath, kebabName }
				);
		if (!exists) {
			break;
		}
		attempt++;
		kebabName = insertCounter(baseKebabName, attempt);
	}

	const prefix = args.folderPath ? `${args.folderPath}/` : '';
	const s3Key = args.projectId
		? `projects/${args.projectId}/documents/${prefix}${kebabName}`
		: `company/documents/${prefix}${kebabName}`;
	return { kebabName, s3Key };
}

function uploadPdf(s3Key: string, buffer: Buffer): Promise<void> {
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucket = process.env.CDN_BUCKET_NAME;
	if (!(region && accessKeyId && secretAccessKey && bucket)) {
		throw new Error('Missing AWS configuration');
	}
	const client = new S3Client({
		region,
		credentials: { accessKeyId, secretAccessKey },
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED',
	});
	return client
		.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: s3Key,
				Body: buffer,
				ContentType: PDF_CONTENT_TYPE,
			})
		)
		.then(() => undefined);
}

export const save = action({
	args: {
		name: v.string(),
		dateLabel: v.string(),
		contentHtml: v.string(),
		fromHtml: v.string(),
		recipients: v.array(
			v.object({ name: v.string(), company: v.optional(v.string()) })
		),
		scope: v.union(v.literal('company'), v.literal('project')),
		projectId: v.optional(v.id('projects')),
		folderPath: v.string(),
	},
	returns: v.object({
		s3Key: v.string(),
		url: v.string(),
		fileName: v.string(),
		documentId: v.string(),
	}),
	handler: async (
		ctx,
		args
	): Promise<{
		s3Key: string;
		url: string;
		fileName: string;
		documentId: string;
	}> => {
		await requireAdmin(ctx);

		if (args.scope === 'project' && !args.projectId) {
			throw new Error('A project is required for project-scoped letters.');
		}

		const fileName = `${args.name.trim()}.pdf`;
		const { kebabName, s3Key } = await resolveDocumentKey(ctx, {
			fileName,
			folderPath: args.folderPath,
			projectId: args.scope === 'project' ? args.projectId : undefined,
		});

		const buffer = await buildLetterPdfBuffer({
			contentHtml: args.contentHtml,
			fromHtml: args.fromHtml,
			dateLabel: args.dateLabel,
			recipients: args.recipients,
		});

		await uploadPdf(s3Key, buffer);

		const createArgs = {
			name: fileName,
			kebabName,
			s3Key,
			folderPath: args.folderPath,
			size: buffer.length,
			mimeType: PDF_CONTENT_TYPE,
			letterContentHtml: args.contentHtml,
		};
		const documentId =
			args.scope === 'project' && args.projectId
				? await ctx.runMutation(api.projectDocuments.create.create, {
						...createArgs,
						projectId: args.projectId,
					})
				: await ctx.runMutation(api.companyDocuments.create.create, createArgs);

		return { s3Key, url: buildSignedUrl(s3Key), fileName, documentId };
	},
});
