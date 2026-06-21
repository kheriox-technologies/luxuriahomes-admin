import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow } from './shared';

export const listNotes = query({
	args: {
		taskId: v.id('tasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTaskOrThrow(ctx, args.taskId);
		const rows = await ctx.db
			.query('taskNotes')
			.withIndex('by_task', (q) => q.eq('taskId', args.taskId))
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
