import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTakeoffCategorySearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTakeoffCategoryOrThrow, parseTakeoffCategoryName } from './shared';

export const update = mutation({
	args: {
		takeoffCategoryId: v.id('takeoffCategories'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTakeoffCategoryOrThrow(ctx, args.takeoffCategoryId);
		const name = parseTakeoffCategoryName(args.name);
		const searchText = buildTakeoffCategorySearchText(name);
		await ctx.db.patch(args.takeoffCategoryId, { name, searchText });
		return args.takeoffCategoryId;
	},
});
