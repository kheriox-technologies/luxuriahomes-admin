import { mutation } from '../_generated/server';
import { syncServiceProviderSearchText } from './shared';

/** Rebuilds searchText for every service provider; run once after expanding the search index. */
export const resyncAll = mutation({
	args: {},
	handler: async (ctx) => {
		const rows = await ctx.db.query('serviceProviders').collect();
		for (const row of rows) {
			await syncServiceProviderSearchText(ctx, row._id);
		}
		return { updated: rows.length };
	},
});
