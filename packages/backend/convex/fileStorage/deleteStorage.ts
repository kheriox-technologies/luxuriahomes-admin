import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const deleteStorage = mutation({
	args: {
		storageId: v.id('_storage'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await ctx.storage.delete(args.storageId);
	},
});
