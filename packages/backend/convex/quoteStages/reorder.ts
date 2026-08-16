import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		stageIds: v.array(v.id('quoteStages')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const [index, stageId] of args.stageIds.entries()) {
			await ctx.db.patch(stageId, { order: index });
		}
	},
});
