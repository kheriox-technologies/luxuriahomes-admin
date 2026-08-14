import { v } from 'convex/values';
import { query } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getVisibleTaskOrThrow } from './shared';

export const listNotes = query({
	args: {
		taskId: v.id('tasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		await getVisibleTaskOrThrow(ctx, args.taskId, identity.subject);
		const rows = await ctx.db
			.query('taskNotes')
			.withIndex('by_task', (q) => q.eq('taskId', args.taskId))
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
