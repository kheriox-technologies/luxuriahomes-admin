import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { generateQuotationReference, isQuotationReference } from './reference';

// 30^6 codes against a few hundred quotations: a single re-roll is already
// beyond unlikely, so exhausting this many means something else is wrong.
const MAX_ATTEMPTS = 10;

/**
 * Confirms the quotation reference that will be printed and stored.
 *
 * The composer generates a candidate on mount so the code shows in the form and
 * on the live preview; it passes that back as `preferred` and this keeps it
 * unless it has since been taken. Being a mutation, two admins saving at the
 * same moment serialize under Convex's OCC.
 */
export const reserveReference = mutation({
	args: { preferred: v.optional(v.string()) },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const isTaken = async (reference: string) => {
			const existing = await ctx.db
				.query('clientQuotations')
				.withIndex('by_reference', (q) => q.eq('reference', reference))
				.first();
			return existing !== null;
		};

		if (
			args.preferred &&
			isQuotationReference(args.preferred) &&
			!(await isTaken(args.preferred))
		) {
			return { reference: args.preferred };
		}

		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			const reference = generateQuotationReference();
			if (!(await isTaken(reference))) {
				return { reference };
			}
		}
		throw new ConvexError({
			code: 'REFERENCE_UNAVAILABLE',
			message: 'Could not allocate a quotation reference. Please try again.',
		});
	},
});
