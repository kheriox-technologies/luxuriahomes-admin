import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTakeoffCategorySearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseTakeoffCategoryName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseTakeoffCategoryName(args.name);
		const searchText = buildTakeoffCategorySearchText(name);
		return await ctx.db.insert('takeoffCategories', { name, searchText });
	},
});
