import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from './shared';

export const remove = mutation({
	args: {
		stageId: v.id('tradeStages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);

		// Detach member trades so they fall back to the Ungrouped bucket rather than
		// being orphaned or deleted.
		const members = await ctx.db
			.query('trades')
			.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
			.collect();
		for (const trade of members) {
			await ctx.db.patch(trade._id, { stageId: undefined });
		}

		await ctx.db.delete(args.stageId);
		return args.stageId;
	},
});
