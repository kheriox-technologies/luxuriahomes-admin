import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	createUnitResolutionCaches,
	getProjectOrThrow,
	resolveUnitAbbrByCode,
} from './shared';

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
		const sorted = rows.sort((a, b) => a.code.localeCompare(b.code));
		const unitCaches = createUnitResolutionCaches();
		return await Promise.all(
			sorted.map(async (row) => {
				const firstNote = await ctx.db
					.query('projectInclusionNotes')
					.withIndex('by_project_inclusion', (q) =>
						q.eq('projectInclusionId', row._id)
					)
					.first();
				const unitAbbr = await resolveUnitAbbrByCode(ctx, row.code, unitCaches);
				return { ...row, hasNotes: firstNote !== null, unitAbbr };
			})
		);
	},
});
