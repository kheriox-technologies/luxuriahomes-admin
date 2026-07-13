import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Flat, one-row-per-trade budget summary for the project. Each row carries the
 * trade's set budget price and its Xero-driven "Actual" — the sum of the trade's
 * mapped Chart-of-Accounts amounts for this project (from `xeroAccountActuals`).
 * `xeroActual` is `null` when the trade has no synced actual (UI shows "—").
 *
 * The portal Budgets tab uses `projectSummary` (project-scoped, with unmapped-code
 * warnings) instead; this all-trades flat shape is kept for the mobile app's
 * budgets/quotations/orders screens, which key off individual trades.
 */
export const tradeSummary = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const [trades, projectBudgets, accountActuals] = await Promise.all([
			ctx.db.query('trades').collect(),
			ctx.db
				.query('projectBudgets')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
			ctx.db
				.query('xeroAccountActuals')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
		]);

		const budgetByTrade = new Map(
			projectBudgets.map((pb) => [pb.tradeId, pb] as const)
		);
		const actualByAccount = new Map<string, number>(
			accountActuals.map((row) => [row.accountId, row.amount] as const)
		);

		const rows = trades.map((trade) => {
			const projectBudget = budgetByTrade.get(trade._id) ?? null;
			// 1:1 mapping — the trade's actual is its single code's amount.
			const accountId = trade.xeroAccountId ?? null;
			const amount = accountId ? actualByAccount.get(accountId) : undefined;
			return {
				tradeId: trade._id,
				tradeName: trade.name,
				tradeDescription: trade.description ?? null,
				stageId: trade.stageId ?? null,
				tradeOrder: trade.order ?? null,
				projectBudgetId: projectBudget?._id ?? null,
				budgetPrice: projectBudget?.price ?? null,
				xeroActual: amount ?? null,
				xeroAccountId: accountId,
				// Single-element list kept for the mobile app's badge rendering.
				xeroAccountIds: accountId ? [accountId] : [],
			};
		});

		return rows.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
	},
});
