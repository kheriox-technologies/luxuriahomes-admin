import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { withTradeNames } from './withTradeNames';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('budgets').order('desc').collect();
		const enriched = await withTradeNames(ctx, rows);
		return enriched.sort((a, b) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
		);
	},
});
