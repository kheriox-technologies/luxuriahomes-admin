import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectInclusionOrThrow } from './shared';

export const listNotes = query({
	args: {
		projectInclusionId: v.id('projectInclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectInclusionOrThrow(ctx, args.projectInclusionId);
		const rows = await ctx.db
			.query('projectInclusionNotes')
			.withIndex('by_project_inclusion', (q) =>
				q.eq('projectInclusionId', args.projectInclusionId)
			)
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
