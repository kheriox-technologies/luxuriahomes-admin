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

		// Enrich each item with its trade's name, stage and order, fetching each
		// trade only once. The stage/order drive the client-side grouping + DnD.
		const tradeById = new Map<
			Id<'trades'>,
			{
				name: string | null;
				stageId: Id<'tradeStages'> | null;
				order: number | null;
			}
		>();
		for (const item of items) {
			if (!tradeById.has(item.tradeId)) {
				const trade = await ctx.db.get(item.tradeId);
				tradeById.set(item.tradeId, {
					name: trade?.name ?? null,
					stageId: trade?.stageId ?? null,
					order: trade?.order ?? null,
				});
			}
		}

		const enriched = items.map((item) => {
			const trade = tradeById.get(item.tradeId);
			return {
				...item,
				tradeName: trade?.name ?? null,
				stageId: trade?.stageId ?? null,
				tradeOrder: trade?.order ?? null,
			};
		});

		return enriched.sort((a, b) =>
			(a.tradeName ?? '').localeCompare(b.tradeName ?? '', undefined, {
				sensitivity: 'base',
			})
		);
	},
});
