import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Rewrites the whole list's sort positions from the order the ids arrive in.
 * The frontend sends every exclusion after a drag, so `order` always ends up
 * dense and zero-based.
 */
export const reorder = mutation({
	args: {
		exclusionIds: v.array(v.id('quoteExclusions')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const [index, exclusionId] of args.exclusionIds.entries()) {
			await ctx.db.patch(exclusionId, { order: index });
		}
	},
});
