import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteItemOrThrow } from './shared';

export const toggleDefault = mutation({
	args: {
		itemId: v.id('quoteItems'),
		isDefault: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteItemOrThrow(ctx, args.itemId);
		await ctx.db.patch(args.itemId, { isDefault: args.isDefault });
		return args.itemId;
	},
});
