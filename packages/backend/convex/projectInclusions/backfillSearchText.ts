import { mutation } from '../_generated/server';
import { buildProjectInclusionSearchText } from './shared';

/** Rebuilds `searchText` for every projectInclusion; run once after adding location names and status to the search blob. */
export const resyncAll = mutation({
	args: {},
	handler: async (ctx) => {
		const rows = await ctx.db.query('projectInclusions').collect();
		for (const row of rows) {
			const searchText = buildProjectInclusionSearchText(row.title, {
				code: row.code,
				vendor: row.vendor,
				models: row.models,
				color: row.color,
				locations: row.locations,
				status: row.status,
			});
			await ctx.db.patch(row._id, { searchText });
		}
		return { updated: rows.length };
	},
});
