import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

interface BudgetRow {
	budgetPrice: number | null;
	projectBudgetId: Id<'projectBudgets'>;
	stageId: Id<'tradeStages'> | null;
	tradeDescription: string | null;
	tradeId: Id<'trades'>;
	tradeName: string;
	tradeOrder: number | null;
	xeroAccountId: string | null;
	xeroActual: number | null;
}

/**
 * Project Budgets tab rows: one per trade in the project (a `projectBudgets`
 * row), each with its budget price, single mapped Xero code, and that code's
 * Xero "Actual" for the project (from `xeroAccountActuals`). With the 1:1
 * trade↔code model each trade's actual is simply its code's amount — no grouping
 * or double-counting.
 *
 * Also returns `unmappedCodes`: Xero accounts with project spend that no trade in
 * this project maps to, for the Budgets tab's warning alert.
 */
export const projectSummary = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const [projectBudgets, accountActuals] = await Promise.all([
			ctx.db
				.query('projectBudgets')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
			ctx.db
				.query('xeroAccountActuals')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
		]);

		const actualByAccount = new Map<string, number>(
			accountActuals.map((row) => [row.accountId, row.amount] as const)
		);

		const trades = await Promise.all(
			projectBudgets.map((pb) => ctx.db.get(pb.tradeId))
		);

		const rows: BudgetRow[] = [];
		const mappedCodes = new Set<string>();
		for (const [index, pb] of projectBudgets.entries()) {
			const trade = trades[index];
			if (!trade) {
				// Defensive: budget pointing at a deleted trade — skip it.
				continue;
			}
			const accountId = trade.xeroAccountId ?? null;
			if (accountId) {
				mappedCodes.add(accountId);
			}
			const amount = accountId ? actualByAccount.get(accountId) : undefined;
			rows.push({
				tradeId: trade._id,
				tradeName: trade.name,
				tradeDescription: trade.description ?? null,
				stageId: trade.stageId ?? null,
				tradeOrder: trade.order ?? null,
				projectBudgetId: pb._id,
				budgetPrice: pb.price ?? null,
				xeroAccountId: accountId,
				xeroActual: amount ?? null,
			});
		}

		rows.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);

		const unmappedCodes = accountActuals
			.filter((row) => row.amount !== 0 && !mappedCodes.has(row.accountId))
			.map((row) => ({ accountId: row.accountId, amount: row.amount }));

		return { rows, unmappedCodes };
	},
});
