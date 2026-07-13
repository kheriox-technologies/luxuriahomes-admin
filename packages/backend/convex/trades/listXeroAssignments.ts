import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Which Xero account GUID each trade is mapped to, for the mapping combobox to
 * mark codes already taken by another trade (the 1:1 rule). Only trades with a
 * mapping are returned.
 */
export const listXeroAssignments = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const trades = await ctx.db.query('trades').collect();
		return trades
			.filter((trade) => Boolean(trade.xeroAccountId))
			.map((trade) => ({
				accountId: trade.xeroAccountId as string,
				tradeId: trade._id,
				tradeName: trade.name,
			}));
	},
});
