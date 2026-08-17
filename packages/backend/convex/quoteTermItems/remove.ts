import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteTermItemOrThrow } from './shared';

export const remove = mutation({
	args: {
		itemId: v.id('quoteTermItems'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteTermItemOrThrow(ctx, args.itemId);
		await ctx.db.delete(args.itemId);
		return args.itemId;
	},
});
