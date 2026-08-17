import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteExclusionOrThrow } from './shared';

export const remove = mutation({
	args: {
		exclusionId: v.id('quoteExclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteExclusionOrThrow(ctx, args.exclusionId);
		await ctx.db.delete(args.exclusionId);
		return args.exclusionId;
	},
});
