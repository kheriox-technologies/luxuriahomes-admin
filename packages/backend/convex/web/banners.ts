import { v } from 'convex/values';
import { query } from '../_generated/server';

/**
 * Public (unauthenticated) banner list for the marketing website hero.
 * Intentionally NOT gated by `requireAdmin`.
 */
export const list = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id('banners'),
			_creationTime: v.number(),
			key: v.string(),
		})
	),
	handler: async (ctx) => {
		const banners = await ctx.db.query('banners').collect();
		// Ascending display order so the hero honors the admin ordering. Fall back
		// to `_creationTime` for any row not yet backfilled with an `order`.
		const ordered = banners.sort(
			(a, b) => (a.order ?? a._creationTime) - (b.order ?? b._creationTime)
		);
		// Project to public fields only — `sourceKey` is an internal reference to
		// the source project media and must not be exposed to the marketing site.
		return ordered.map((banner) => ({
			_id: banner._id,
			_creationTime: banner._creationTime,
			key: banner.key,
		}));
	},
});
