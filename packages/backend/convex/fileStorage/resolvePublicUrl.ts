import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const resolvePublicUrl = mutation({
	args: {
		storageId: v.id('_storage'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const url = await ctx.storage.getUrl(args.storageId);
		if (!url) {
			throw new ConvexError({
				code: 'STORAGE_NOT_FOUND',
				message: 'No file found for this storage id',
			});
		}
		return { storageId: args.storageId, url };
	},
});
