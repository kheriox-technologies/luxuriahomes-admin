import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

const UNREAD_LIMIT = 10;

export const listUnread = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('notifications')
			.withIndex('by_read', (q) => q.eq('read', false))
			.order('desc')
			.take(UNREAD_LIMIT);
	},
});
