import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const tasks = await ctx.db.query('tasks').collect();
		return tasks.sort((a, b) => a.order - b.order);
	},
});
