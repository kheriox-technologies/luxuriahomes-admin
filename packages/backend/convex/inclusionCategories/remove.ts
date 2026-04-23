import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = mutation({
	args: {
		categoryId: v.id('inclusionCategories'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.categoryId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Category not found',
			});
		}
		await ctx.db.delete(args.categoryId);
		return args.categoryId;
	},
});
