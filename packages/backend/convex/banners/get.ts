import { v } from 'convex/values';
import { internalQuery } from '../_generated/server';

/** Loads a banner by id for the `remove` action (which has no db access). */
export const get = internalQuery({
	args: {
		bannerId: v.id('banners'),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get(args.bannerId);
	},
});
