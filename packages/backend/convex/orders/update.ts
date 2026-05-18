import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildOrderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getOrderOrThrow,
	parseDescription,
	parseDuration,
	parseOrderName,
	validateTaskBelongsToStage,
} from './shared';

export const update = mutation({
	args: {
		orderId: v.id('orders'),
		name: v.string(),
		description: v.optional(v.string()),
		duration: v.number(),
		stageId: v.optional(v.id('stages')),
		taskId: v.optional(v.id('tasks')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getOrderOrThrow(ctx, args.orderId);

		const name = parseOrderName(args.name);
		const description = parseDescription(args.description);
		const duration = parseDuration(args.duration);

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

		await ctx.db.patch(args.orderId, {
			name,
			description,
			duration,
			stageId: args.stageId,
			taskId: args.taskId,
			searchText,
		});
	},
});
