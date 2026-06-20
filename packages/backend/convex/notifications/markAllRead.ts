import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const markAllRead = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const unread = await ctx.db
			.query('notifications')
			.withIndex('by_read', (q) => q.eq('read', false))
			.collect();
		await Promise.all(
			unread.map((notification) =>
				ctx.db.patch(notification._id, { read: true })
			)
		);
		return unread.length;
	},
});
