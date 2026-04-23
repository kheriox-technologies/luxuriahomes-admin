import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { ensureCategoryNameUnique, parseCategoryName } from './shared';

export const update = mutation({
	args: {
		categoryId: v.id('inclusionCategories'),
		name: v.string(),
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

		const name = parseCategoryName(args.name);
		await ensureCategoryNameUnique(ctx, name, args.categoryId);

		await ctx.db.patch(args.categoryId, { name });
		return args.categoryId;
	},
});
