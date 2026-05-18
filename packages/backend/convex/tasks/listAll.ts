import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listAll = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		return await ctx.db.query('tasks').collect();
	},
});
