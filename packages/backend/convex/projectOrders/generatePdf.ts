'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { PDF_LOGO_DATA_URL } from '../projectInclusions/pdf/logo';
import { renderPdfToBuffer } from '../projectInclusions/pdf/render';
import { buildOrderDocDefinition } from './pdf/docDefinition';

const trailingSlash = /\/$/;
const SIGNED_URL_TTL_MS = 3_600_000;

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

function uploadPdf(
	projectId: string,
	orderId: string,
	buffer: Buffer
): Promise<string> {
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucket = process.env.CDN_BUCKET_NAME;
	if (!(region && accessKeyId && secretAccessKey && bucket)) {
		throw new Error('Missing AWS configuration');
	}
	const s3Key = `projects/${projectId}/orders/${orderId}-${crypto.randomUUID()}.pdf`;
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
				ContentType: 'application/pdf',
			})
		)
		.then(() => s3Key);
}

export const generatePdf = action({
	args: {
		orderId: v.id('projectOrders'),
	},
	returns: v.object({ s3Key: v.string(), url: v.string() }),
	handler: async (ctx, args): Promise<{ s3Key: string; url: string }> => {
		await requireAdmin(ctx);

		const order = await ctx.runQuery(api.projectOrders.get.get, {
			orderId: args.orderId,
		});
		const project = await ctx.runQuery(api.projects.get.get, {
			projectId: order.projectId,
		});
		if (!project) {
			throw new Error('Project not found');
		}

		const docDefinition = buildOrderDocDefinition(
			PDF_LOGO_DATA_URL,
			{
				email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
				phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
			},
			{
				orderId: order.orderId,
				vendor: order.vendor,
				items: order.items,
				projectAddress: project.address,
			}
		);

		const buffer = await renderPdfToBuffer(docDefinition);
		const s3Key = await uploadPdf(order.projectId, order.orderId, buffer);
		return { s3Key, url: buildSignedUrl(s3Key) };
	},
});
