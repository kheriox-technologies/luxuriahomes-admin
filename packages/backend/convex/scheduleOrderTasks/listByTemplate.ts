import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByTemplate = query({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('scheduleOrderTasks')
			.withIndex('by_schedule_template', (q) =>
				q.eq('scheduleTemplateId', args.scheduleTemplateId)
			)
			.collect();
	},
});
