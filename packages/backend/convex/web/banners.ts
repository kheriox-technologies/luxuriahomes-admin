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
	handler: async (ctx) => await ctx.db.query('banners').order('desc').collect(),
});
