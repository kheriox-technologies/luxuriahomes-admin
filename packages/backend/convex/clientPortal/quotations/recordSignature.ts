import { ConvexError } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	recordSignatureArgs,
	recordSignatureFor,
	recordSignatureReturns,
} from '../../clientQuotations/recordSignatureShared';
import { normalizeSignerEmail } from '../../clientQuotations/shared';
import { requireQuotationClient } from './shared';

/** A client signing their own quotation. */
export const recordSignature = mutation({
	args: recordSignatureArgs,
	returns: recordSignatureReturns,
	handler: async (ctx, args) => {
		const { identity, quotation } = await requireQuotationClient(
			ctx,
			args.quotationId
		);

		const email = normalizeSignerEmail(identity.email ?? '');
		const clientIndex = quotation.clients.findIndex(
			(client) => normalizeSignerEmail(client.email) === email
		);
		if (clientIndex < 0) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You do not have access to this quotation',
			});
		}

		return await recordSignatureFor(
			ctx,
			quotation,
			{
				clientIndex,
				email,
				// The name on the quotation, not the one on the Clerk account — the
				// document has to name the party it was addressed to.
				name: quotation.clients[clientIndex]?.name ?? email,
				role: 'Client',
				subject: identity.subject,
			},
			args
		);
	},
});
