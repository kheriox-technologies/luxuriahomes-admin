import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getSpecialInclusionOrThrow } from './shared';

export const remove = mutation({
	args: {
		inclusionId: v.id('quotationSpecialInclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getSpecialInclusionOrThrow(ctx, args.inclusionId);
		await ctx.db.delete(args.inclusionId);
		return args.inclusionId;
	},
});
