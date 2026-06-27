import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTakeoffCategoryOrThrow } from './shared';

export const remove = mutation({
	args: {
		takeoffCategoryId: v.id('takeoffCategories'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTakeoffCategoryOrThrow(ctx, args.takeoffCategoryId);
		await ctx.db.delete(args.takeoffCategoryId);
		return args.takeoffCategoryId;
	},
});
