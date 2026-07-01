import { internalMutation } from '../_generated/server';

/**
 * One-time migration. For every banner it:
 *   1. Assigns a clean sequential `order` (1, 2, 3…) by creation time, so
 *      ordering is deterministic once the `order` field ships.
 *   2. Strips the deprecated `title`/`description` fields from the document.
 *
 * Run once after deploy: `npx convex run banners:backfillOrder`. After it has
 * run, the optional `title`/`description` fields can be removed from the schema.
 */
export const backfillOrder = internalMutation({
	args: {},
	handler: async (ctx) => {
		const banners = await ctx.db.query('banners').order('asc').collect();
		let order = 1;
		for (const banner of banners) {
			await ctx.db.patch(banner._id, {
				order,
				title: undefined,
				description: undefined,
			});
			order += 1;
		}
	},
});
