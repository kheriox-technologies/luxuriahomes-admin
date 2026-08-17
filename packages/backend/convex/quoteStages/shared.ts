import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildQuoteStageSearchText } from '../lib/buildSearchText';

export function parseQuoteStageName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Stage name is required',
		});
	}
	return trimmed;
}

export async function getQuoteStageOrThrow(
	ctx: QueryCtx,
	stageId: Id<'quoteStages'>
) {
	const stage = await ctx.db.get(stageId);
	if (!stage) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quote stage not found',
		});
	}
	return stage;
}

/**
 * Next sort position for a new stage, appended after existing stages.
 */
export async function nextQuoteStageOrder(ctx: MutationCtx): Promise<number> {
	const stages = await ctx.db.query('quoteStages').collect();
	return stages.length;
}

const MAX_PERCENT = 100;

/**
 * Progress-payment share and scope-of-works line for the six QBCC stages the
 * catalogue ships with, keyed by lowercased stage name. Used by the catalogue
 * seed and by `migration/backfillQuoteStageDefaults` for deployments that were
 * seeded before these fields existed. The percentages total exactly 100, so a
 * freshly seeded catalogue produces a valid quotation without any editing.
 */
export const QUOTE_STAGE_DEFAULTS: Record<
	string,
	{ defaultPercent: number; scopeSummary: string }
> = {
	deposit: {
		defaultPercent: 5,
		scopeSummary:
			'Contract signing, engineering, soil test, council and certifier lodgement',
	},
	base: {
		defaultPercent: 15,
		scopeSummary:
			'Site cut, piering, basement retaining, waffle raft slab poured and cured',
	},
	frame: {
		defaultPercent: 20,
		scopeSummary:
			'Structural steel, wall and roof framing complete and frame inspection passed',
	},
	enclosed: {
		defaultPercent: 25,
		scopeSummary:
			'Roof cover, external cladding, windows and external doors installed',
	},
	fixing: {
		defaultPercent: 20,
		scopeSummary:
			'Linings, joinery, stone, tiling, internal doors, skirtings and architraves',
	},
	'practical completion': {
		defaultPercent: 15,
		scopeSummary:
			'Pool, landscaping, driveway, final clean, handover and warranty documents',
	},
};

/**
 * Clamps a progress-payment percentage to 0–100. `undefined` stays undefined so
 * a stage created without one reads as "not set" rather than 0%.
 */
export function parseQuoteStageDefaultPercent(
	percent: number | undefined
): number | undefined {
	if (percent === undefined) {
		return;
	}
	if (!Number.isFinite(percent)) {
		throw new ConvexError({
			code: 'INVALID_PERCENT',
			message: 'Stage percentage must be a number',
		});
	}
	return Math.min(Math.max(percent, 0), MAX_PERCENT);
}

export function parseQuoteStageScopeSummary(
	scopeSummary: string | undefined
): string | undefined {
	return scopeSummary?.trim() || undefined;
}

export interface QuoteStageDefaults {
	defaultPercent?: number;
	scopeSummary?: string;
}

/**
 * Inserts a stage from a raw name with computed order + searchText. Shared by the
 * stage dialog and the inline "or create new stage" flow on the item form.
 */
export async function createQuoteStage(
	ctx: MutationCtx,
	rawName: string,
	defaults: QuoteStageDefaults = {}
): Promise<Id<'quoteStages'>> {
	const name = parseQuoteStageName(rawName);
	const searchText = buildQuoteStageSearchText(name);
	const order = await nextQuoteStageOrder(ctx);
	return await ctx.db.insert('quoteStages', {
		name,
		order,
		defaultPercent: parseQuoteStageDefaultPercent(defaults.defaultPercent),
		scopeSummary: parseQuoteStageScopeSummary(defaults.scopeSummary),
		searchText,
	});
}
