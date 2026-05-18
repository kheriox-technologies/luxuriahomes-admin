import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		stageId: v.id('stages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const stage = await ctx.db.get(args.stageId);
		if (!stage) {
			return null;
		}

		const tasks = await ctx.db
			.query('tasks')
			.withIndex('by_stage_display_order', (q) => q.eq('stageId', args.stageId))
			.collect();

		return { stage, tasks };
	},
});
