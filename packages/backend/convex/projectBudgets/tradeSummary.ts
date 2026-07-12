import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * One row per trade for the project Budgets tab: the trade's set budget price
 * and its Xero-driven "Actual" (sum of the trade's mapped Chart-of-Accounts P&L
 * amounts for this project, synced into `xeroTradeActuals`). `xeroActual` is
 * `null` when the trade has no synced actual — the UI shows "—".
 */
export const tradeSummary = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const [trades, projectBudgets, xeroActuals] = await Promise.all([
			ctx.db.query('trades').collect(),
			ctx.db
				.query('projectBudgets')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
			ctx.db
				.query('xeroTradeActuals')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
		]);

		const budgetByTrade = new Map(
			projectBudgets.map((pb) => [pb.tradeId, pb] as const)
		);
		const actualByTrade = new Map<Id<'trades'>, number>(
			xeroActuals.map((row) => [row.tradeId, row.amount] as const)
		);

		const rows = trades.map((trade) => {
			const projectBudget = budgetByTrade.get(trade._id) ?? null;
			return {
				tradeId: trade._id,
				tradeName: trade.name,
				tradeDescription: trade.description ?? null,
				stageId: trade.stageId ?? null,
				tradeOrder: trade.order ?? null,
				projectBudgetId: projectBudget?._id ?? null,
				budgetPrice: projectBudget?.price ?? null,
				xeroActual: actualByTrade.get(trade._id) ?? null,
				// Mapped Xero account GUIDs so the Budgets tab can show code badges.
				xeroAccountIds: trade.xeroAccountIds ?? [],
			};
		});

		return rows.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
	},
});
