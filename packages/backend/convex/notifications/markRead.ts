import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const markRead = mutation({
	args: {
		notificationId: v.id('notifications'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await ctx.db.patch(args.notificationId, { read: true });
		return args.notificationId;
	},
});
