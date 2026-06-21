import type { Doc, Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';

export type BudgetWithTradeName = Doc<'budgets'> & {
	tradeName: string | null;
};

/**
 * Enriches budget rows with their trade's name, fetching each referenced
 * trade only once so the table can render the trade without a second query.
 */
export async function withTradeNames(
	ctx: QueryCtx,
	budgets: Doc<'budgets'>[]
): Promise<BudgetWithTradeName[]> {
	const tradeNameById = new Map<Id<'trades'>, string | null>();
	for (const budget of budgets) {
		if (!tradeNameById.has(budget.tradeId)) {
			const trade = await ctx.db.get(budget.tradeId);
			tradeNameById.set(budget.tradeId, trade?.name ?? null);
		}
	}
	return budgets.map((budget) => ({
		...budget,
		tradeName: tradeNameById.get(budget.tradeId) ?? null,
	}));
}
