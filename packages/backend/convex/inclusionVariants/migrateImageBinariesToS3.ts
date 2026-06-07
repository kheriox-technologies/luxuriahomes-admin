'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import { internalAction } from '../_generated/server';

interface PendingRecord {
	_id: Id<'inclusionVariants'>;
	image: string;
}

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/svg+xml': 'svg',
	'image/webp': 'webp',
};

export const migrateImageBinariesToS3 = internalAction({
	args: {
		batchSize: v.optional(v.number()),
	},
	returns: v.object({
		processed: v.number(),
		skipped: v.number(),
		hasMore: v.boolean(),
	}),
	handler: async (
		ctx,
		args
	): Promise<{ processed: number; skipped: number; hasMore: boolean }> => {
		const limit = args.batchSize ?? 50;

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
		});

		// Fetch one extra to detect whether more records remain after this batch
		const records = (await ctx.runQuery(
			internal.inclusionVariants.migrateImageHelpers.getPendingBatch,
			{ limit: limit + 1 }
		)) as PendingRecord[];

		const batch: PendingRecord[] = records.slice(0, limit);
		const hasMore: boolean = records.length > limit;

		let processed = 0;
		let skipped = 0;

		for (const record of batch) {
			const imageUrl = record.image;
			try {
				const response = await fetch(imageUrl);
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				const rawContentType =
					response.headers.get('content-type') ?? 'image/jpeg';
				const contentType =
					rawContentType.split(';')[0]?.trim() ?? 'image/jpeg';
				const ext = CONTENT_TYPE_TO_EXT[contentType] ?? 'jpg';
				const s3Key = `images/inclusions/${crypto.randomUUID()}.${ext}`;

				const bytes = await response.arrayBuffer();
				await client.send(
					new PutObjectCommand({
						Bucket: bucket,
						Key: s3Key,
						Body: Buffer.from(bytes),
						ContentType: contentType,
					})
				);

				await ctx.runMutation(
					internal.inclusionVariants.migrateImageHelpers.patchImage,
					{ id: record._id, image: s3Key }
				);

				console.log(`migrated variant ${record._id} → ${s3Key}`);
				processed++;
			} catch (error) {
				console.error(`skipped variant ${record._id} (${imageUrl}):`, error);
				skipped++;
			}
		}

		return { processed, skipped, hasMore };
	},
});
