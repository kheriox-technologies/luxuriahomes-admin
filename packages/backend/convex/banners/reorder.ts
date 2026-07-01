import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Persists a banner's display order after a drag-to-reorder. The client passes
 * a fractional `order` (the midpoint between the drop neighbors), mirroring the
 * ordering scheme used by the tasks board.
 */
export const reorder = mutation({
	args: {
		bannerId: v.id('banners'),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.bannerId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Banner not found',
			});
		}
		await ctx.db.patch(args.bannerId, { order: args.order });
		return args.bannerId;
	},
});
