import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const banners = await ctx.db.query('banners').collect();
		// Ascending display order. Fall back to `_creationTime` for any row not
		// yet backfilled with an explicit `order`.
		return banners.sort(
			(a, b) => (a.order ?? a._creationTime) - (b.order ?? b._creationTime)
		);
	},
});
