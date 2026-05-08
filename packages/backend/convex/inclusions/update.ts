import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getInclusionOrThrow,
	parseInclusionTitle,
	syncSearchTextsForInclusion,
} from './shared';

export const update = mutation({
	args: {
		inclusionId: v.id('inclusions'),
		title: v.string(),
		categoryId: v.optional(v.id('inclusionCategories')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getInclusionOrThrow(ctx, args.inclusionId);
		const title = parseInclusionTitle(args.title);

		const nextCategoryId = args.categoryId ?? existing.categoryId;
		if (nextCategoryId !== existing.categoryId) {
			const newCategory = await ctx.db.get(nextCategoryId);
			if (!newCategory) {
				throw new ConvexError({
					code: 'NOT_FOUND',
					message: 'Category not found',
				});
			}
			const oldCategory = await ctx.db.get(existing.categoryId);
			if (oldCategory) {
				await ctx.db.patch(existing.categoryId, {
					count: Math.max(0, oldCategory.count - 1),
				});
			}
			await ctx.db.patch(nextCategoryId, {
				count: newCategory.count + 1,
			});
		}

		await ctx.db.patch(args.inclusionId, {
			title,
			categoryId: nextCategoryId,
		});
		await syncSearchTextsForInclusion(ctx, args.inclusionId);
		return args.inclusionId;
	},
});
