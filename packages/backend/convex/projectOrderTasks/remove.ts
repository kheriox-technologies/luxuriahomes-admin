import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectOrderTaskOrThrow } from './shared';

export const remove = mutation({
	args: {
		orderTaskId: v.id('projectOrderTasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectOrderTaskOrThrow(ctx, args.orderTaskId);
		await ctx.db.delete(args.orderTaskId);
		return args.orderTaskId;
	},
});
