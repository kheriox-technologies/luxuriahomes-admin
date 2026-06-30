import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

/**
 * Deletes a banner record. Called by the `remove` action after the banner's
 * object has been removed from the static bucket.
 */
export const removeRecord = internalMutation({
	args: {
		bannerId: v.id('banners'),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.bannerId);
		return args.bannerId;
	},
});
