import { query } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { canViewTask } from './shared';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const tasks = await ctx.db.query('tasks').collect();
		return tasks
			.filter((task) => canViewTask(task, identity.subject))
			.sort((a, b) => a.order - b.order);
	},
});
