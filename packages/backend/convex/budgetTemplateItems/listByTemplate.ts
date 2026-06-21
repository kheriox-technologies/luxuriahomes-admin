import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByTemplate = query({
	args: { budgetTemplateId: v.id('budgetTemplates') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const items = await ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template', (q) =>
				q.eq('budgetTemplateId', args.budgetTemplateId)
			)
			.collect();

		// Enrich each item with its trade name, fetching each trade only once.
		const tradeNameById = new Map<Id<'trades'>, string | null>();
		for (const item of items) {
			if (!tradeNameById.has(item.tradeId)) {
				const trade = await ctx.db.get(item.tradeId);
				tradeNameById.set(item.tradeId, trade?.name ?? null);
			}
		}

		const enriched = items.map((item) => ({
			...item,
			tradeName: tradeNameById.get(item.tradeId) ?? null,
		}));

		return enriched.sort((a, b) =>
			(a.tradeName ?? '').localeCompare(b.tradeName ?? '', undefined, {
				sensitivity: 'base',
			})
		);
	},
});
