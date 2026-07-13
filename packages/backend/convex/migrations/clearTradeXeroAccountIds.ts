import { internalMutation } from '../_generated/server';

/**
 * One-off cleanup: unsets the deprecated `trades.xeroAccountIds` array on every
 * trade so the field can be dropped from the schema. Superseded by the single
 * `xeroAccountId`. Idempotent — safe to re-run. Run once per deployment
 * (`npx convex run migrations/clearTradeXeroAccountIds:clearTradeXeroAccountIds`,
 * add `--prod` for production), then remove this file and the schema field.
 */
export const clearTradeXeroAccountIds = internalMutation({
	args: {},
	handler: async (ctx) => {
		const trades = await ctx.db.query('trades').collect();
		let cleared = 0;
		for (const trade of trades) {
			if (trade.xeroAccountIds !== undefined) {
				await ctx.db.patch(trade._id, { xeroAccountIds: undefined });
				cleared++;
			}
		}
		return { cleared, total: trades.length };
	},
});
