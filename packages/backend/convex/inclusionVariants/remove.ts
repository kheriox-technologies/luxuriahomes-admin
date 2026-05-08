import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { syncSearchTextsForInclusion } from '../inclusions/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { deleteVariantStorageIfPresent } from './shared';

export const remove = mutation({
	args: {
		variantId: v.id('inclusionVariants'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.variantId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Variant not found',
			});
		}
		const inclusionId = existing.inclusionId;
		await deleteVariantStorageIfPresent(ctx, existing.storageId);
		await ctx.db.delete(args.variantId);
		await syncSearchTextsForInclusion(ctx, inclusionId);
		return args.variantId;
	},
});
