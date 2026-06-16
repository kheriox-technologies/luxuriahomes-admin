import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectStageOrThrow } from './shared';

export const remove = mutation({
	args: {
		stageId: v.id('projectStages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const stage = await getProjectStageOrThrow(ctx, args.stageId);

		// Delete all tasks in this stage
		const tasks = await ctx.db
			.query('projectTasks')
			.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
			.collect();
		for (const task of tasks) {
			await ctx.db.delete(task._id);
		}

		// Null out dependency references from sibling stages
		const siblings = await ctx.db
			.query('projectStages')
			.withIndex('by_project', (q) => q.eq('projectId', stage.projectId))
			.collect();
		for (const sibling of siblings) {
			if (sibling.dependencyStageId === args.stageId) {
				await ctx.db.patch(sibling._id, {
					dependencyStageId: undefined,
					dependencyType: undefined,
				});
			}
		}

		await ctx.db.delete(args.stageId);
		return args.stageId;
	},
});
