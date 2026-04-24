import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { syncSearchTextsForInclusion } from './shared';

/** Rebuilds `searchText` (and variantCount) for every inclusion; run once after adding category terms to the aggregate search blob. */
export const resyncAll = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const inclusions = await ctx.db.query('inclusions').collect();
		for (const row of inclusions) {
			await syncSearchTextsForInclusion(ctx, row._id);
		}
		return { updated: inclusions.length };
	},
});
