import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	recordSignatureArgs,
	recordSignatureFor,
	recordSignatureReturns,
} from './recordSignatureShared';
import {
	addedByFromIdentity,
	getClientQuotationOrThrow,
	normalizeSignerEmail,
} from './shared';

/**
 * The Luxuria Homes countersignature. Any admin may give it — the company is the
 * party, not one named individual — but the row records who actually did.
 */
export const recordSignature = mutation({
	args: recordSignatureArgs,
	returns: recordSignatureReturns,
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);

		return await recordSignatureFor(
			ctx,
			quotation,
			{
				email: normalizeSignerEmail(identity.email ?? ''),
				name: addedByFromIdentity(identity),
				role: 'Representative',
				subject: identity.subject,
			},
			args
		);
	},
});
