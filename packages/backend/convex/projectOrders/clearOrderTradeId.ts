import { internalMutation } from '../_generated/server';

/**
 * One-off migration: clear the deprecated `tradeId` field on every projectOrders
 * doc so the field can be removed from the schema without tripping Convex
 * document validation. Orders are no longer linked to a trade (budgets/actuals
 * are Xero-driven). Run once from the Convex dashboard
 * (`internal.projectOrders.clearOrderTradeId.clearOrderTradeId`) after this
 * change deploys, then delete this file and drop `tradeId` from schema.ts.
 * Returns the number of orders fixed; safe to re-run (returns 0 when clean).
 */
export const clearOrderTradeId = internalMutation({
	args: {},
	handler: async (ctx) => {
		const orders = await ctx.db.query('projectOrders').collect();
		let cleared = 0;
		for (const order of orders) {
			if (order.tradeId !== undefined) {
				await ctx.db.patch(order._id, { tradeId: undefined });
				cleared++;
			}
		}
		return { cleared, total: orders.length };
	},
});
