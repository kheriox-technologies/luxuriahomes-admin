import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByTemplate = query({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const tasks = await ctx.db
			.query('scheduleTasks')
			.withIndex('by_schedule_template', (q) =>
				q.eq('scheduleTemplateId', args.scheduleTemplateId)
			)
			.collect();
		return tasks.sort((a, b) => {
			if (a.stageId !== b.stageId) {
				return a.stageId.localeCompare(b.stageId);
			}
			return a.order - b.order;
		});
	},
});
