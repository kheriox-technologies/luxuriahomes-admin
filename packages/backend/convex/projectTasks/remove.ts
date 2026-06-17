import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getProjectTaskOrThrow,
	recalcStageDates,
	recalcStageStatus,
} from './shared';

export const remove = mutation({
	args: {
		taskId: v.id('projectTasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getProjectTaskOrThrow(ctx, args.taskId);
		const stageId = task.stageId;

		// Null out dependency references from sibling tasks
		const siblings = await ctx.db
			.query('projectTasks')
			.withIndex('by_stage', (q) => q.eq('stageId', stageId))
			.collect();
		for (const sibling of siblings) {
			if (sibling.dependencyTaskId === args.taskId) {
				await ctx.db.patch(sibling._id, {
					dependencyTaskId: undefined,
					dependencyType: undefined,
				});
			}
		}

		// Delete any order task attached to this task
		const orderTask = await ctx.db
			.query('projectOrderTasks')
			.withIndex('by_parent_task', (q) => q.eq('parentTaskId', args.taskId))
			.first();
		if (orderTask) {
			await ctx.db.delete(orderTask._id);
		}

		await ctx.db.delete(args.taskId);
		await recalcStageDates(ctx, stageId);
		await recalcStageStatus(ctx, stageId);

		return args.taskId;
	},
});
