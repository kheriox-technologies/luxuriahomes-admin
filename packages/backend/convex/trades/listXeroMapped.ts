import { internalQuery } from '../_generated/server';

/**
 * Returns every trade that has a Xero Chart-of-Accounts mapping set. Used by the
 * Xero financials sync to know which trades' per-project "Actual" values to
 * compute. Internal-only.
 */
export const listXeroMapped = internalQuery({
	args: {},
	handler: async (ctx) => {
		const trades = await ctx.db.query('trades').collect();
		return trades
			.filter((trade) => (trade.xeroAccountIds?.length ?? 0) > 0)
			.map((trade) => ({
				_id: trade._id,
				xeroAccountIds: trade.xeroAccountIds as string[],
			}));
	},
});
