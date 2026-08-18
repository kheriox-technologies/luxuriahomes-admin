'use node';

import { ConvexError, v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { action } from '../_generated/server';
import { getPortalUrl } from '../clientPortal/shared';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { buildSignatureRequestEmail } from './emailContent';
import { APPROVED_QUOTATION_STATUS, addedByFromIdentity } from './shared';

/**
 * Asks every client named on an approved quotation to sign it, and moves the
 * quotation to 'Awaiting Signatures'.
 *
 * Only an approved quotation can be sent — signatures are collected against a
 * settled document, and a quotation still under review is by definition not one.
 *
 * Each client gets their own message. The link opens that client's signing
 * session and the portal matches it against the signed-in address, so a combined
 * send would give every recipient a link only one of them could open.
 */
export const requestSignatures = action({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	returns: v.object({ sent: v.number() }),
	handler: async (ctx, args): Promise<{ sent: number }> => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		const quotation = await ctx.runQuery(
			internal.clientQuotations.internal.getForSend,
			{ quotationId: args.quotationId }
		);

		if (quotation.status !== APPROVED_QUOTATION_STATUS) {
			throw new ConvexError({
				code: 'INVALID_STATUS',
				message:
					'Only an approved quotation can be sent for signature. Have the clients approve it first.',
			});
		}

		const { s3Key, fileName } = quotation;
		if (!(s3Key && fileName)) {
			throw new ConvexError({
				code: 'NO_PDF',
				message:
					'This quotation has no PDF to attach. Save it again to generate one.',
			});
		}

		const portalUrl = getPortalUrl();
		let sent = 0;

		// Sequential for the same reason as `sendToClients`: a partial failure is
		// far easier to reason about — and to retry — in a known order.
		for (const client of quotation.clients) {
			const email = client.email.trim();
			if (email === '') {
				continue;
			}

			const { html, text } = buildSignatureRequestEmail(
				quotation,
				{ ...client, email },
				args.quotationId,
				portalUrl
			);
			await ctx.runAction(api.email.send.send, {
				to: [email],
				subject: `Please sign quotation ${quotation.reference} — ${quotation.projectName}`,
				html,
				text,
				attachments: [
					{ filename: fileName, contentType: 'application/pdf', s3Key },
				],
				relatedTable: 'clientQuotations',
				relatedId: args.quotationId,
			});
			sent += 1;
		}

		if (sent === 0) {
			throw new ConvexError({
				code: 'NO_RECIPIENTS',
				message: 'This quotation has no client email addresses to send to.',
			});
		}

		await ctx.runMutation(
			internal.clientQuotations.internal.markAwaitingSignatures,
			{
				quotationId: args.quotationId,
				requestedBy: addedByFromIdentity(identity),
			}
		);

		return { sent };
	},
});
