import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getOrderTaskOrThrow } from './shared';

export const remove = mutation({
	args: {
		orderTaskId: v.id('scheduleOrderTasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getOrderTaskOrThrow(ctx, args.orderTaskId);
		await ctx.db.delete(args.orderTaskId);
		return args.orderTaskId;
	},
});
