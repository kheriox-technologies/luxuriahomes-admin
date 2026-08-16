import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByStage = query({
	args: { stageId: v.id('quoteStages') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('quoteSections')
			.withIndex('by_stage_order', (q) => q.eq('stageId', args.stageId))
			.order('asc')
			.collect();
	},
});
