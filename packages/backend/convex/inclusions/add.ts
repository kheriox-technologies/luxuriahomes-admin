import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildInclusionAggregateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseInclusionTitle } from './shared';

export const add = mutation({
	args: {
		title: v.string(),
		categoryId: v.id('inclusionCategories'),
		standardPrice: v.optional(v.number()),
		standardLabourPrice: v.optional(v.number()),
		measurementUnit: v.optional(v.id('units')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const title = parseInclusionTitle(args.title);
		const category = await ctx.db.get(args.categoryId);
		if (!category) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Category not found',
			});
		}
		const searchText = buildInclusionAggregateSearchText(title, [], {
			code: category.code,
			name: category.name,
		});
		const inclusionId = await ctx.db.insert('inclusions', {
			title,
			categoryId: args.categoryId,
			searchText,
			variantCount: 0,
			standardPrice: args.standardPrice,
			standardLabourPrice: args.standardLabourPrice,
			measurementUnit: args.measurementUnit,
		});
		await ctx.db.patch(args.categoryId, {
			count: category.count + 1,
		});
		return inclusionId;
	},
});
