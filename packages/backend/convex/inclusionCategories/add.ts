import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildInclusionCategorySearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	ensureCategoryCodeUnique,
	ensureCategoryNameUnique,
	parseCategoryCode,
	parseCategoryName,
} from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		code: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseCategoryName(args.name);
		const code = parseCategoryCode(args.code);
		await ensureCategoryNameUnique(ctx, name);
		await ensureCategoryCodeUnique(ctx, code);
		const searchText = buildInclusionCategorySearchText(name, code);
		return await ctx.db.insert('inclusionCategories', {
			name,
			code,
			count: 0,
			searchText,
		});
	},
});
