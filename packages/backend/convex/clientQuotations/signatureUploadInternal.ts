import { ConvexError, v } from 'convex/values';
import { internalQuery } from '../_generated/server';
import { isQuotationClient } from '../clientPortal/quotations/shared';
import { checkIdentity, isAdmin } from '../lib/checkIdentity';
import {
	AWAITING_SIGNATURES_STATUS,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	readActiveSignatures,
} from './shared';

/**
 * Authorizes a signer to upload the document they have just signed, and decides
 * what it is called and where it is filed.
 *
 * The caller supplies only the quotation: a client is not an admin and must not
 * be able to name an arbitrary S3 key, so the destination is derived here from
 * the quotation's own folder. The counter in the name is the position in the
 * signing order, which keeps each intermediate signed copy distinguishable in
 * the document library.
 */
export const authorizeSignatureUpload = internalQuery({
	args: { quotationId: v.id('clientQuotations') },
	returns: v.object({ fileName: v.string(), folderPath: v.string() }),
	handler: async (
		ctx,
		args
	): Promise<{ fileName: string; folderPath: string }> => {
		const identity = await checkIdentity(ctx);
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);

		const admin = await isAdmin(ctx);
		if (!(admin || isQuotationClient(quotation, identity.email))) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You do not have access to this quotation',
			});
		}

		if (quotation.status !== AWAITING_SIGNATURES_STATUS) {
			throw new ConvexError({
				code: 'INVALID_STATUS',
				message: 'This quotation is not awaiting signatures.',
			});
		}

		const version = quotation.version ?? FIRST_VERSION;
		const active = await readActiveSignatures(ctx, quotation._id, version);

		return {
			fileName: `${quotation.reference} - ${quotation.projectName} - v${version} - signed ${active.length + 1}.pdf`,
			folderPath: quotation.folderPath ?? '',
		};
	},
});
