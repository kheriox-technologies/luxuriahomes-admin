import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { type MutationCtx, mutation } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { syncMaterialSearchText } from '../materials/shared';
import { syncQuotationSearchText } from '../projectQuotations/shared';
import { syncServiceProviderSearchText } from '../serviceProviders/shared';
import { getTradeOrThrow, nextTradeOrder, parseTradeName } from './shared';

/**
 * Trade names are denormalized into the searchText of every material, quotation,
 * and service provider that references the trade. Renaming a trade would leave
 * those search indexes stale, so rebuild them here whenever the name changes.
 */
async function reindexTradeReferences(ctx: MutationCtx, tradeId: Id<'trades'>) {
	const [materials, quotations, serviceProviders] = await Promise.all([
		ctx.db
			.query('materials')
			.withIndex('by_trade', (q) => q.eq('tradeId', tradeId))
			.collect(),
		ctx.db
			.query('projectQuotations')
			.withIndex('by_trade', (q) => q.eq('tradeId', tradeId))
			.collect(),
		// serviceProviders.tradeIds is an array with no per-trade index.
		ctx.db.query('serviceProviders').collect(),
	]);

	for (const material of materials) {
		await syncMaterialSearchText(ctx, material._id);
	}
	for (const quotation of quotations) {
		await syncQuotationSearchText(ctx, quotation._id);
	}
	for (const provider of serviceProviders) {
		if (provider.tradeIds.includes(tradeId)) {
			await syncServiceProviderSearchText(ctx, provider._id);
		}
	}
}

export const update = mutation({
	args: {
		tradeId: v.id('trades'),
		name: v.string(),
		description: v.optional(v.string()),
		// undefined → leave the stage unchanged; null → move to Ungrouped; an id →
		// move into that stage (appended to its end).
		stageId: v.optional(v.union(v.id('tradeStages'), v.null())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getTradeOrThrow(ctx, args.tradeId);
		const name = parseTradeName(args.name);
		// Only touch the description when the caller explicitly provides it, so a
		// name-only rename (e.g. from the budget pages) preserves the existing
		// description instead of clearing it.
		const description =
			args.description === undefined
				? existing.description
				: args.description.trim() || undefined;
		const searchText = buildTradeSearchText(name, description);
		const patch: {
			name: string;
			description: string | undefined;
			searchText: string;
			stageId?: Id<'tradeStages'> | undefined;
			order?: number;
		} = { name, description, searchText };
		// Re-slot into the target stage only when the caller changes it.
		if (args.stageId !== undefined) {
			const nextStageId = args.stageId ?? undefined;
			if (nextStageId !== existing.stageId) {
				patch.stageId = nextStageId;
				patch.order = await nextTradeOrder(ctx, nextStageId);
			}
		}
		await ctx.db.patch(args.tradeId, patch);
		if (existing.name !== name) {
			await reindexTradeReferences(ctx, args.tradeId);
		}
		return args.tradeId;
	},
});
