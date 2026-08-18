'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { toKebabCase } from '../lib/toKebabCase';

const MAX_NAME_ATTEMPTS = 50;
const UPLOAD_URL_TTL_SECONDS = 300;

function insertCounter(kebabName: string, counter: number): string {
	const lastDot = kebabName.lastIndexOf('.');
	if (lastDot > 0) {
		return `${kebabName.slice(0, lastDot)}-${counter}${kebabName.slice(lastDot)}`;
	}
	return `${kebabName}-${counter}`;
}

/**
 * A presigned PUT for the document a signer has just signed.
 *
 * Deliberately not `companyDocuments.generateUploadUrl`, which requires the
 * admin role: a client signing their own quotation has no such role, and giving
 * them one would be far too broad. The only argument is the quotation, so the
 * key is derived server-side and a signer can never write outside the folder
 * their own quotation lives in.
 *
 * The upload is not itself recorded — `recordSignature` inserts the
 * `companyDocuments` row once the signature is accepted. An upload whose
 * signature is then rejected leaves an unreferenced object in the bucket, which
 * is a stray file rather than a broken record.
 */
export const generateSignatureUploadUrl = action({
	args: { quotationId: v.id('clientQuotations') },
	returns: v.object({
		fileName: v.string(),
		folderPath: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		uploadUrl: v.string(),
	}),
	handler: async (
		ctx,
		args
	): Promise<{
		fileName: string;
		folderPath: string;
		kebabName: string;
		s3Key: string;
		uploadUrl: string;
	}> => {
		const { fileName, folderPath } = await ctx.runQuery(
			internal.clientQuotations.signatureUploadInternal
				.authorizeSignatureUpload,
			{ quotationId: args.quotationId }
		);

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const bucket = process.env.CDN_BUCKET_NAME;

		if (!(region && accessKeyId && secretAccessKey && bucket)) {
			throw new Error('Missing AWS configuration');
		}

		const baseKebabName = toKebabCase(fileName);
		let kebabName = baseKebabName;
		let attempt = 0;

		while (attempt < MAX_NAME_ATTEMPTS) {
			const exists = await ctx.runQuery(
				internal.companyDocuments.shared.checkDocumentKebabNameExists,
				{ folderPath, kebabName }
			);
			if (!exists) {
				break;
			}
			attempt++;
			kebabName = insertCounter(baseKebabName, attempt);
		}

		const prefix = folderPath ? `${folderPath}/` : '';
		const s3Key = `company/documents/${prefix}${kebabName}`;

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
				ContentType: 'application/pdf',
			}),
			{ expiresIn: UPLOAD_URL_TTL_SECONDS }
		);

		return { fileName, folderPath, kebabName, s3Key, uploadUrl };
	},
});
