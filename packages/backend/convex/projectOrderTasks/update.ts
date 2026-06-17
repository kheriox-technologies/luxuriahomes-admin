import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getProjectOrderTaskOrThrow,
	parseOrderTaskDurationDays,
	parseOrderTaskName,
} from './shared';

export const update = mutation({
	args: {
		orderTaskId: v.id('projectOrderTasks'),
		name: v.string(),
		durationDays: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectOrderTaskOrThrow(ctx, args.orderTaskId);

		const name = parseOrderTaskName(args.name);
		const durationDays = parseOrderTaskDurationDays(args.durationDays);

		await ctx.db.patch(args.orderTaskId, { name, durationDays });
	},
});
