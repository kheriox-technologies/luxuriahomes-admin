import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow } from '../trades/shared';
import { createTradeStage } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		// Ungrouped trades to pull into the new stage on creation.
		tradeIds: v.optional(v.array(v.id('trades'))),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const stageId = await createTradeStage(ctx, args.name);

		// Append selected trades to the freshly created (empty) stage in order.
		let position = 0;
		for (const tradeId of args.tradeIds ?? []) {
			await getTradeOrThrow(ctx, tradeId);
			await ctx.db.patch(tradeId, { stageId, order: position });
			position += 1;
		}

		return stageId;
	},
});
