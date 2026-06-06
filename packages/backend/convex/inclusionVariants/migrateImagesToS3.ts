import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

export const migrateImagesToS3 = internalMutation({
	args: {
		cursor: v.optional(v.string()),
		batchSize: v.optional(v.number()),
	},
	returns: v.object({
		processed: v.number(),
		nextCursor: v.union(v.string(), v.null()),
	}),
	handler: async (ctx, args) => {
		const numItems = args.batchSize ?? 50;
		const result = await ctx.db
			.query('inclusionVariants')
			.paginate({ cursor: args.cursor ?? null, numItems });

		let processed = 0;
		for (const variant of result.page) {
			// Clear any legacy storageId field that may exist in the document
			// (the schema no longer declares storageId, but existing documents may have it)
			const doc = variant as Record<string, unknown>;
			if (doc.storageId !== undefined) {
				await ctx.db.patch(variant._id, { storageId: undefined } as never);
				processed++;
			}
		}

		return {
			processed,
			nextCursor: result.isDone ? null : result.continueCursor,
		};
	},
});
