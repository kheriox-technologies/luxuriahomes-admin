import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { requireProjectClient } from '../../lib/clientAccess';
import { getProjectInclusionOrThrow } from '../../projectInclusions/shared';

export const listNotes = query({
	args: {
		projectInclusionId: v.id('projectInclusions'),
	},
	handler: async (ctx, args) => {
		const inclusion = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		await requireProjectClient(ctx, inclusion.projectId);
		const rows = await ctx.db
			.query('projectInclusionNotes')
			.withIndex('by_project_inclusion', (q) =>
				q.eq('projectInclusionId', args.projectInclusionId)
			)
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
