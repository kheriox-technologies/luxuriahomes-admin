import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteItemOrThrow } from './shared';

export const remove = mutation({
	args: {
		itemId: v.id('quoteItems'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteItemOrThrow(ctx, args.itemId);
		await ctx.db.delete(args.itemId);
		return args.itemId;
	},
});
