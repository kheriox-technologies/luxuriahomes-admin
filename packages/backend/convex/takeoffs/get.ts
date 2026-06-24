import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		takeoffId: v.id('takeoffs'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		// Return null (not throw) when the row is missing: this reactive query
		// stays subscribed for a beat after the take-off is deleted, and a thrown
		// NOT_FOUND would log a spurious error on every delete.
		return await ctx.db.get(args.takeoffId);
	},
});
