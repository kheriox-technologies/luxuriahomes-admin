import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildInclusionCategorySearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { ensureCategoryNameUnique, parseCategoryName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseCategoryName(args.name);
		await ensureCategoryNameUnique(ctx, name);
		const searchText = buildInclusionCategorySearchText(name);
		return await ctx.db.insert('inclusionCategories', {
			name,
			count: 0,
			searchText,
		});
	},
});
