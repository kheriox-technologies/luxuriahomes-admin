import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';

/**
 * The investment plus its singleton assumptions row. Throws when the slug has
 * not been seeded yet, so the page surfaces a clear error rather than rendering
 * an empty forecast.
 */
export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		await requireSuperAdmin(ctx);
		const investment = await ctx.db
			.query('investments')
			.withIndex('by_slug', (q) => q.eq('slug', slug))
			.unique();
		if (!investment) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: `No investment found for "${slug}"`,
			});
		}
		const assumptions = await ctx.db
			.query('investmentAssumptions')
			.withIndex('by_investment', (q) => q.eq('investmentId', investment._id))
			.unique();
		return { investment, assumptions };
	},
});
