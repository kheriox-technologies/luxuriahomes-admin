import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getLocationOrThrow } from './shared';

export const remove = mutation({
	args: {
		locationId: v.id('locations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getLocationOrThrow(ctx, args.locationId);
		await ctx.db.delete(args.locationId);
		return args.locationId;
	},
});
