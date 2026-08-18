import { v } from 'convex/values';
import { query } from '../_generated/server';
import { checkIdentity, isAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity, normalizeSignerEmail } from './shared';
import {
	buildSigningContext,
	signingContextValidator,
} from './signatureContext';

/**
 * The Luxuria Homes representative's signing session.
 *
 * Any admin may countersign — the office is the party to the contract, not one
 * named individual — but the row records whoever actually did, so the trail
 * still names a person. Anyone without the role gets `{ authorized: false }` and
 * the unauthorized screen.
 */
export const signingContext = query({
	args: { quotationId: v.id('clientQuotations') },
	returns: signingContextValidator,
	handler: async (ctx, args) => {
		const identity = await checkIdentity(ctx);
		if (!(await isAdmin(ctx))) {
			return { authorized: false as const };
		}

		const quotation = await ctx.db.get(args.quotationId);
		if (!quotation) {
			return { authorized: false as const };
		}

		return await buildSigningContext(ctx, quotation, {
			email: normalizeSignerEmail(identity.email ?? ''),
			name: addedByFromIdentity(identity),
			role: 'Representative',
		});
	},
});
