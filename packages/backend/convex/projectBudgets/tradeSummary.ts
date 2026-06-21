import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const tradeSummary = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const [trades, projectBudgets, approvedQuotations] = await Promise.all([
			ctx.db.query('trades').collect(),
			ctx.db
				.query('projectBudgets')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.collect(),
			ctx.db
				.query('projectQuotations')
				.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
				.filter((q) => q.eq(q.field('status'), 'Approved'))
				.collect(),
		]);

		const budgetByTrade = new Map(
			projectBudgets.map((pb) => [pb.tradeId, pb] as const)
		);

		const quotationTotals = new Map<
			Id<'trades'>,
			{ total: number; count: number }
		>();
		for (const quotation of approvedQuotations) {
			const current = quotationTotals.get(quotation.tradeId) ?? {
				total: 0,
				count: 0,
			};
			current.total += quotation.price;
			current.count += 1;
			quotationTotals.set(quotation.tradeId, current);
		}

		const rows = await Promise.all(
			trades.map(async (trade) => {
				const projectBudget = budgetByTrade.get(trade._id) ?? null;
				const budget = projectBudget
					? await ctx.db.get(projectBudget.budgetId)
					: null;
				const quotation = quotationTotals.get(trade._id) ?? {
					total: 0,
					count: 0,
				};
				return {
					tradeId: trade._id,
					tradeName: trade.name,
					projectBudgetId: projectBudget?._id ?? null,
					budgetTitle: budget?.title ?? null,
					budgetPrice: budget?.price ?? null,
					totalQuotationPrice: quotation.total,
					quotationCount: quotation.count,
				};
			})
		);

		return rows.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
	},
});
