import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import { investmentAssumptionsFields } from './shared';

/**
 * Patches the singleton assumptions row, creating it if the investment was
 * seeded without one. Called debounced from the assumptions panel, so it takes
 * the full set of values rather than a partial patch.
 */
export const updateAssumptions = mutation({
	args: {
		investmentId: v.id('investments'),
		...investmentAssumptionsFields,
	},
	handler: async (ctx, { investmentId, ...values }) => {
		await requireSuperAdmin(ctx);
		const investment = await ctx.db.get(investmentId);
		if (!investment) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Investment not found',
			});
		}
		const existing = await ctx.db
			.query('investmentAssumptions')
			.withIndex('by_investment', (q) => q.eq('investmentId', investmentId))
			.unique();
		if (existing) {
			await ctx.db.patch(existing._id, values);
			return existing._id;
		}
		return await ctx.db.insert('investmentAssumptions', {
			investmentId,
			...values,
		});
	},
});
