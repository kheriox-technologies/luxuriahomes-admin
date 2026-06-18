import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { addBusinessDaysToTimestamp } from '../projectTasks/shared';
import { getOrderOrThrow } from './shared';

export const linkOrderTask = mutation({
	args: {
		orderId: v.id('projectOrders'),
		orderTaskId: v.union(v.id('projectOrderTasks'), v.null()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getOrderOrThrow(ctx, args.orderId);

		if (args.orderTaskId === null) {
			await ctx.db.patch(args.orderId, {
				orderTaskId: undefined,
				orderBy: undefined,
				deliverBy: undefined,
			});
			return;
		}

		const orderTask = await ctx.db.get(args.orderTaskId);
		if (!orderTask) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Order task not found',
			});
		}
		const parentTask = await ctx.db.get(orderTask.parentTaskId);
		if (!parentTask) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Parent task not found',
			});
		}

		// deliverBy = day before parent task starts (last business day of order task)
		const deliverBy = addBusinessDaysToTimestamp(parentTask.startDate, -1);
		// orderBy = order task start = deliverBy minus (durationDays - 1) business days
		const orderBy = addBusinessDaysToTimestamp(
			deliverBy,
			-(orderTask.durationDays - 1)
		);

		await ctx.db.patch(args.orderId, {
			orderTaskId: args.orderTaskId,
			orderBy,
			deliverBy,
		});
	},
});
