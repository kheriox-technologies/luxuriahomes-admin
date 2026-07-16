import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildBudgetTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getTemplateOrThrow,
	parseTemplateTitle,
	recomputeTemplateTotal,
	seedMissingTradeItems,
} from './shared';

const CENTS = 100;

export const copy = mutation({
	args: {
		sourceBudgetTemplateId: v.id('budgetTemplates'),
		title: v.string(),
		percentage: v.optional(v.number()),
		adjustmentType: v.optional(
			v.union(v.literal('increase'), v.literal('decrease'))
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const source = await getTemplateOrThrow(ctx, args.sourceBudgetTemplateId);
		const title = parseTemplateTitle(args.title);

		const percentage = args.percentage ?? 0;
		if (!Number.isFinite(percentage) || percentage < 0) {
			throw new ConvexError({
				code: 'INVALID_PERCENTAGE',
				message: 'Percentage must be a positive number',
			});
		}
		const adjustmentType = args.adjustmentType ?? 'increase';
		if (adjustmentType === 'decrease' && percentage > 100) {
			throw new ConvexError({
				code: 'INVALID_PERCENTAGE',
				message: 'Percentage decrease cannot exceed 100%',
			});
		}
		const factor =
			adjustmentType === 'decrease'
				? 1 - percentage / 100
				: 1 + percentage / 100;

		const description = source.description;
		const searchText = buildBudgetTemplateSearchText(title, description);

		const newBudgetTemplateId = await ctx.db.insert('budgetTemplates', {
			title,
			description,
			totalPrice: 0,
			searchText,
		});

		const items = await ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template', (q) =>
				q.eq('budgetTemplateId', args.sourceBudgetTemplateId)
			)
			.collect();

		for (const item of items) {
			await ctx.db.insert('budgetTemplateItems', {
				budgetTemplateId: newBudgetTemplateId,
				tradeId: item.tradeId,
				price: Math.round(item.price * factor * CENTS) / CENTS,
			});
		}

		// Seed $0 rows for any trade created after the source was last seeded.
		await seedMissingTradeItems(ctx, newBudgetTemplateId);
		await recomputeTemplateTotal(ctx, newBudgetTemplateId);

		return newBudgetTemplateId;
	},
});
