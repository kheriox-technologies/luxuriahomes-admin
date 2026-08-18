import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { normalizeSignerEmail } from '../../clientQuotations/shared';
import {
	buildSigningContext,
	signingContextValidator,
} from '../../clientQuotations/signatureContext';
import { checkIdentity } from '../../lib/checkIdentity';
import { isVisibleToClients } from './shared';

/**
 * A client's signing session.
 *
 * Returns `{ authorized: false }` rather than throwing when the signed-in user
 * is not a client on this quotation. Someone who forwards their signing link is
 * the expected case, not an exceptional one, and the page turns that into the
 * unauthorized screen without an error boundary. Enforcement lives in
 * `recordSignature`, which refuses outright.
 */
export const signingContext = query({
	args: { quotationId: v.id('clientQuotations') },
	returns: signingContextValidator,
	handler: async (ctx, args) => {
		const identity = await checkIdentity(ctx);
		const quotation = await ctx.db.get(args.quotationId);
		if (!(quotation && isVisibleToClients(quotation))) {
			return { authorized: false as const };
		}

		const email = normalizeSignerEmail(identity.email ?? '');
		const clientIndex = quotation.clients.findIndex(
			(client) => normalizeSignerEmail(client.email) === email
		);
		if (email === '' || clientIndex < 0) {
			return { authorized: false as const };
		}

		return await buildSigningContext(ctx, quotation, {
			clientIndex,
			email,
			name: quotation.clients[clientIndex]?.name ?? '',
			role: 'Client',
		});
	},
});
