import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Batched reorder that covers both reordering trades within a stage and moving a
 * trade to another stage (including the Ungrouped bucket). The frontend sends every
 * trade whose stage or order changed across the affected groups. A null stageId
 * clears the trade back to Ungrouped.
 */
export const reorderTrades = mutation({
	args: {
		updates: v.array(
			v.object({
				tradeId: v.id('trades'),
				stageId: v.union(v.id('tradeStages'), v.null()),
				order: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const update of args.updates) {
			await ctx.db.patch(update.tradeId, {
				stageId: update.stageId ?? undefined,
				order: update.order,
			});
		}
	},
});
