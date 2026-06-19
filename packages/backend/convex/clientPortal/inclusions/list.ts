import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { requireProjectClient } from '../../lib/clientAccess';

export const list = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireProjectClient(ctx, args.projectId);
		const rows = await ctx.db
			.query('projectInclusions')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		const sorted = rows.sort((a, b) => a.code.localeCompare(b.code));
		return await Promise.all(
			sorted.map(async (row) => {
				const firstNote = await ctx.db
					.query('projectInclusionNotes')
					.withIndex('by_project_inclusion', (q) =>
						q.eq('projectInclusionId', row._id)
					)
					.first();
				const category = await ctx.db.get(row.categoryId);
				return {
					...row,
					hasNotes: firstNote !== null,
					categoryName: category?.name ?? 'Uncategorised',
				};
			})
		);
	},
});
