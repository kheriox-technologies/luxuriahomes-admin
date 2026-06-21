import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const tradeSummary = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const [trades, projectBudgets, approvedQuotations, projectOrders] =
			await Promise.all([
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
				ctx.db
					.query('projectOrders')
					.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
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

		const orderTotals = new Map<
			Id<'trades'>,
			{ total: number; count: number }
		>();
		for (const order of projectOrders) {
			const orderTotal = order.items.reduce(
				(sum, item) => sum + (item.price ?? 0) * item.quantity,
				0
			);
			const current = orderTotals.get(order.tradeId) ?? { total: 0, count: 0 };
			current.total += orderTotal;
			current.count += 1;
			orderTotals.set(order.tradeId, current);
		}

		const rows = trades.map((trade) => {
			const projectBudget = budgetByTrade.get(trade._id) ?? null;
			const quotation = quotationTotals.get(trade._id) ?? {
				total: 0,
				count: 0,
			};
			const order = orderTotals.get(trade._id) ?? {
				total: 0,
				count: 0,
			};
			return {
				tradeId: trade._id,
				tradeName: trade.name,
				projectBudgetId: projectBudget?._id ?? null,
				budgetPrice: projectBudget?.price ?? null,
				totalQuotationPrice: quotation.total,
				quotationCount: quotation.count,
				totalOrderPrice: order.total,
				orderCount: order.count,
			};
		});

		return rows.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
	},
});
