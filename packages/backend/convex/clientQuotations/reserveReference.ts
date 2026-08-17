import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { formatQuotationReference } from './shared';

/**
 * Allocates the next quotation reference for the current year and advances the
 * counter. Being a mutation, two admins saving at the same moment serialize
 * under Convex's OCC and get distinct numbers.
 *
 * The composer calls this *before* building the PDF so the reference can be
 * printed on the document. A save that then fails leaves a gap in the series —
 * the same trade-off every invoice numbering scheme makes.
 */
export const reserveReference = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const year = new Date().getFullYear();
		const counter = await ctx.db
			.query('quotationCounters')
			.withIndex('by_year', (q) => q.eq('year', year))
			.first();
		const seq = (counter?.lastSeq ?? 0) + 1;
		if (counter) {
			await ctx.db.patch(counter._id, { lastSeq: seq });
		} else {
			await ctx.db.insert('quotationCounters', { year, lastSeq: seq });
		}
		return { reference: formatQuotationReference(year, seq), year, seq };
	},
});
