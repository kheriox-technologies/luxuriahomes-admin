import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		takeoffCategoryId: v.id('takeoffCategories'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db.get(args.takeoffCategoryId);
	},
});
