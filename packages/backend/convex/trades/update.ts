import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { type MutationCtx, mutation } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { syncMaterialSearchText } from '../materials/shared';
import { syncQuotationSearchText } from '../projectQuotations/shared';
import { syncServiceProviderSearchText } from '../serviceProviders/shared';
import {
	getTradeOrThrow,
	nextTradeOrder,
	normalizeXeroAccountIds,
	parseTradeName,
} from './shared';

/** True when two normalized (deduped) GUID lists differ as sets. */
function xeroAccountIdsDiffer(
	a: string[] | undefined,
	b: string[] | undefined
): boolean {
	const setA = new Set(a ?? []);
	const setB = new Set(b ?? []);
	if (setA.size !== setB.size) {
		return true;
	}
	for (const id of setA) {
		if (!setB.has(id)) {
			return true;
		}
	}
	return false;
}

/** Deletes every synced actual row for a trade (mapping changed / trade gone). */
async function deleteTradeActuals(ctx: MutationCtx, tradeId: Id<'trades'>) {
	const rows = await ctx.db
		.query('xeroTradeActuals')
		.withIndex('by_trade', (q) => q.eq('tradeId', tradeId))
		.collect();
	for (const row of rows) {
		await ctx.db.delete(row._id);
	}
}

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
		// undefined → leave the Xero account mapping unchanged (a name-only rename
		// from the Budgets tab omits it); an array replaces it (empty array clears).
		xeroAccountIds: v.optional(v.array(v.string())),
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
			xeroAccountIds?: string[] | undefined;
		} = { name, description, searchText };
		// Re-slot into the target stage only when the caller changes it.
		if (args.stageId !== undefined) {
			const nextStageId = args.stageId ?? undefined;
			if (nextStageId !== existing.stageId) {
				patch.stageId = nextStageId;
				patch.order = await nextTradeOrder(ctx, nextStageId);
			}
		}
		// Only touch the mapping when the caller provides it. When it changes, drop
		// the trade's synced actuals so stale values blank immediately; the next
		// sync repopulates from the new accounts.
		let mappingChanged = false;
		if (args.xeroAccountIds !== undefined) {
			const nextAccountIds = normalizeXeroAccountIds(args.xeroAccountIds);
			if (xeroAccountIdsDiffer(nextAccountIds, existing.xeroAccountIds)) {
				patch.xeroAccountIds = nextAccountIds;
				mappingChanged = true;
			}
		}
		await ctx.db.patch(args.tradeId, patch);
		if (mappingChanged) {
			await deleteTradeActuals(ctx, args.tradeId);
		}
		if (existing.name !== name) {
			await reindexTradeReferences(ctx, args.tradeId);
		}
		return args.tradeId;
	},
});
