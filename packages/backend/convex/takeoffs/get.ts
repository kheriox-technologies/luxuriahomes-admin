import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		takeoffId: v.id('takeoffs'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const takeoff = await ctx.db.get(args.takeoffId);
		if (!takeoff) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Takeoff not found',
			});
		}
		return takeoff;
	},
});
