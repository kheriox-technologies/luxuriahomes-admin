import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getVendorOrThrow } from './shared';

export const remove = mutation({
	args: {
		vendorId: v.id('vendors'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getVendorOrThrow(ctx, args.vendorId);
		await ctx.db.delete(args.vendorId);
		return args.vendorId;
	},
});
