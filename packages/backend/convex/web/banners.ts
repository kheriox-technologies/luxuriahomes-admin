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
			title: v.string(),
			description: v.optional(v.string()),
			key: v.string(),
		})
	),
	handler: async (ctx) => {
		const banners = await ctx.db.query('banners').order('desc').collect();
		// Project to public fields only — `sourceKey` is an internal reference to
		// the source project media and must not be exposed to the marketing site.
		return banners.map((banner) => ({
			_id: banner._id,
			_creationTime: banner._creationTime,
			title: banner.title,
			description: banner.description,
			key: banner.key,
		}));
	},
});
