import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildOrderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	parseDescription,
	parseOrderName,
	validateTaskBelongsToStage,
} from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		stageId: v.optional(v.id('stages')),
		taskId: v.optional(v.id('tasks')),
		materials: v.optional(
			v.array(v.object({ name: v.string(), units: v.string() }))
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const name = parseOrderName(args.name);
		const description = parseDescription(args.description);

		if (args.taskId && !args.stageId) {
			throw new ConvexError({
				code: 'TASK_WITHOUT_STAGE',
				message: 'A stageId must be provided when specifying a taskId',
			});
		}

		if (args.stageId) {
			const stage = await ctx.db.get(args.stageId);
			if (!stage) {
				throw new ConvexError({
					code: 'NOT_FOUND',
					message: 'Stage not found',
				});
			}
		}

		if (args.stageId && args.taskId) {
			await validateTaskBelongsToStage(ctx, args.stageId, args.taskId);
		}

		const searchText = buildOrderSearchText(name, description);

		return await ctx.db.insert('orders', {
			name,
			description,
			stageId: args.stageId,
			taskId: args.taskId,
			materials: args.materials,
			searchText,
		});
	},
});
