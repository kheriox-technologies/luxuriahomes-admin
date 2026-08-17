import { internalMutation } from '../_generated/server';
import { QUOTE_STAGE_DEFAULTS } from '../quoteStages/shared';

/**
 * Fills `defaultPercent` and `scopeSummary` on quote stages that were seeded
 * before client quotations existed. Matches on lowercased stage name and only
 * writes fields that are currently unset, so a hand-edited percentage is never
 * clobbered and the migration is safe to re-run.
 *
 *   npx convex run migration/backfillQuoteStageDefaults
 */
export const backfillQuoteStageDefaults = internalMutation({
	args: {},
	handler: async (ctx) => {
		const stages = await ctx.db.query('quoteStages').collect();
		const unmatched: string[] = [];
		let patched = 0;
		let skipped = 0;

		for (const stage of stages) {
			const defaults = QUOTE_STAGE_DEFAULTS[stage.name.trim().toLowerCase()];
			if (!defaults) {
				unmatched.push(stage.name);
				continue;
			}
			const patch: { defaultPercent?: number; scopeSummary?: string } = {};
			if (stage.defaultPercent === undefined) {
				patch.defaultPercent = defaults.defaultPercent;
			}
			if (stage.scopeSummary === undefined) {
				patch.scopeSummary = defaults.scopeSummary;
			}
			if (Object.keys(patch).length === 0) {
				skipped++;
				continue;
			}
			await ctx.db.patch(stage._id, patch);
			patched++;
		}

		return { patched, skipped, unmatched };
	},
});
