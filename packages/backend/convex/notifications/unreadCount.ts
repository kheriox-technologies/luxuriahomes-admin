import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const unreadCount = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const unread = await ctx.db
			.query('notifications')
			.withIndex('by_read', (q) => q.eq('read', false))
			.collect();
		return unread.length;
	},
});
