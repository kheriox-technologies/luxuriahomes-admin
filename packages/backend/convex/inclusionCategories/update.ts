import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildInclusionCategorySearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	ensureCategoryCodeUnique,
	ensureCategoryNameUnique,
	parseCategoryCode,
	parseCategoryName,
} from './shared';

export const update = mutation({
	args: {
		categoryId: v.id('inclusionCategories'),
		name: v.string(),
		code: v.string(),
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
		const code = parseCategoryCode(args.code);
		await ensureCategoryNameUnique(ctx, name, args.categoryId);
		await ensureCategoryCodeUnique(ctx, code, args.categoryId);
		const searchText = buildInclusionCategorySearchText(name, code);

		await ctx.db.patch(args.categoryId, { name, code, searchText });
		return args.categoryId;
	},
});
