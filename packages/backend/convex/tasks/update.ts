import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTaskSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { taskDependencyTypeValidator } from '../schema';
import {
	getTaskOrThrow,
	parseDescription,
	parseDuration,
	parseTaskName,
	syncStageCounters,
} from './shared';

export const update = mutation({
	args: {
		taskId: v.id('tasks'),
		name: v.string(),
		description: v.optional(v.string()),
		duration: v.number(),
		dependsOn: v.optional(
			v.array(
				v.object({
					taskId: v.id('tasks'),
					type: taskDependencyTypeValidator,
				})
			)
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getTaskOrThrow(ctx, args.taskId);

		const name = parseTaskName(args.name);
		const description = parseDescription(args.description);
		const duration = parseDuration(args.duration);
		const searchText = buildTaskSearchText(name, description);

		let dependsOn:
			| Array<{ taskId: typeof args.taskId; type: 'after' | 'alongWith' }>
			| undefined;
		if (args.dependsOn !== undefined) {
			for (const dep of args.dependsOn) {
				if (dep.taskId === args.taskId) {
					throw new ConvexError({
						code: 'SELF_DEPENDENCY',
						message: 'A task cannot depend on itself',
					});
				}
				const exists = await ctx.db.get(dep.taskId);
				if (!exists) {
					throw new ConvexError({
						code: 'NOT_FOUND',
						message: 'Dependency task not found',
					});
				}
			}
			dependsOn = args.dependsOn;
		}

		await ctx.db.patch(args.taskId, {
			name,
			description,
			duration,
			searchText,
			...(dependsOn !== undefined && { dependsOn }),
		});

		await syncStageCounters(ctx, task.stageId);
	},
});
