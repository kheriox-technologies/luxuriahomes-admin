import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { formatQuotationReference } from './shared';

/**
 * The reference a quotation saved right now would most likely get. Advisory
 * only — the composer shows it while the form is being filled, and
 * `reserveReference` allocates the authoritative one on save.
 */
export const nextReference = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const year = new Date().getFullYear();
		const counter = await ctx.db
			.query('quotationCounters')
			.withIndex('by_year', (q) => q.eq('year', year))
			.first();
		const seq = (counter?.lastSeq ?? 0) + 1;
		return { reference: formatQuotationReference(year, seq), year, seq };
	},
});
