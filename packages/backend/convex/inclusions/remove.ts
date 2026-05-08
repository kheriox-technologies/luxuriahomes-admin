import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { deleteVariantStorageIfPresent } from '../inclusionVariants/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { getInclusionOrThrow } from './shared';

export const remove = mutation({
	args: {
		inclusionId: v.id('inclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getInclusionOrThrow(ctx, args.inclusionId);

		const variants = await ctx.db
			.query('inclusionVariants')
			.withIndex('by_inclusion', (q) => q.eq('inclusionId', args.inclusionId))
			.collect();

		for (const variant of variants) {
			await deleteVariantStorageIfPresent(ctx, variant.storageId);
			await ctx.db.delete(variant._id);
		}

		const category = await ctx.db.get(existing.categoryId);
		if (category) {
			await ctx.db.patch(existing.categoryId, {
				count: Math.max(0, category.count - 1),
			});
		}

		await ctx.db.delete(args.inclusionId);
		return args.inclusionId;
	},
});
