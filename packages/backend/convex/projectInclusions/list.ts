import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectOrThrow } from './shared';

export const list = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectOrThrow(ctx, args.projectId);
		const rows = await ctx.db
			.query('projectInclusions')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		return rows.sort((a, b) => a.code.localeCompare(b.code));
	},
});
