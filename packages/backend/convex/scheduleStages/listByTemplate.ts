import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByTemplate = query({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const stages = await ctx.db
			.query('scheduleStages')
			.withIndex('by_schedule_template', (q) =>
				q.eq('scheduleTemplateId', args.scheduleTemplateId)
			)
			.collect();
		return stages.sort((a, b) => a.order - b.order);
	},
});
