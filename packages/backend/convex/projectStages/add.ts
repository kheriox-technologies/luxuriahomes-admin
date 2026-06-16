import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	projectScheduleStatusValidator,
	scheduleDependencyTypeValidator,
} from '../schema';
import { nextProjectStageOrder, parseProjectStageName } from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		dependencyStageId: v.optional(v.id('projectStages')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
		startDate: v.number(),
		endDate: v.number(),
		status: v.optional(projectScheduleStatusValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}
		const name = parseProjectStageName(args.name);

		if (args.dependencyStageId) {
			const dep = await ctx.db.get(args.dependencyStageId);
			if (!dep || dep.projectId !== args.projectId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency stage must belong to the same project',
				});
			}
		}

		const order = await nextProjectStageOrder(ctx, args.projectId);

		return await ctx.db.insert('projectStages', {
			projectId: args.projectId,
			name,
			order,
			dependencyStageId: args.dependencyStageId,
			dependencyType: args.dependencyStageId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
			startDate: args.startDate,
			endDate: args.endDate,
			status: args.status ?? 'Pending',
		});
	},
});
