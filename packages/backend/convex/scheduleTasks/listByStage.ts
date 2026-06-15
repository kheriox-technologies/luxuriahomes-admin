import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByStage = query({
	args: {
		stageId: v.id('scheduleStages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const tasks = await ctx.db
			.query('scheduleTasks')
			.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
			.collect();
		return tasks.sort((a, b) => a.order - b.order);
	},
});
