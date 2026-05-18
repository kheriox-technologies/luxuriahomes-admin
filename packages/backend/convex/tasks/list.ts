import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {
		stageId: v.id('stages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('tasks')
			.withIndex('by_stage_display_order', (q) => q.eq('stageId', args.stageId))
			.collect();
	},
});
