'use node';

import { ConvexError, v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { action } from '../_generated/server';
import { getPortalUrl } from '../clientPortal/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { buildQuotationVersionEmail } from './emailContent';
import { INITIAL_QUOTATION_STATUS } from './shared';

/**
 * Emails a newly issued revision to the clients on the quotation, with that
 * version's PDF attached.
 *
 * Unlike the initial `sendToClients`, this creates no Clerk accounts and moves
 * no status: it only goes out for a quotation that has already been issued, so
 * every recipient already has a login and the lifecycle is already past Draft.
 * A quotation still in Draft is rejected — there is nobody to notify yet.
 */
export const sendVersionToClients = action({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	returns: v.object({ sent: v.number(), version: v.number() }),
	handler: async (ctx, args): Promise<{ sent: number; version: number }> => {
		await requireAdmin(ctx);

		const { description, quotation, version } = await ctx.runQuery(
			internal.clientQuotations.internal.getRevisionForSend,
			{ quotationId: args.quotationId }
		);

		if (quotation.status === INITIAL_QUOTATION_STATUS) {
			throw new ConvexError({
				code: 'INVALID_STATUS',
				message:
					'This quotation has not been sent to the clients yet. Use Send to Client/s first.',
			});
		}

		const { s3Key, fileName } = quotation;
		if (!(s3Key && fileName)) {
			throw new ConvexError({
				code: 'NO_PDF',
				message:
					'This version has no PDF to attach. Save it again to generate one.',
			});
		}

		const portalUrl = getPortalUrl();
		let sent = 0;

		// One message each, addressed personally — and sequential for the same
		// reason as the initial send: a partial failure stays easy to reason about.
		for (const client of quotation.clients) {
			const email = client.email.trim();
			if (email === '') {
				continue;
			}

			const { html, text } = buildQuotationVersionEmail(
				quotation,
				{ ...client, email },
				{ description, number: version },
				portalUrl
			);
			await ctx.runAction(api.email.send.send, {
				to: [email],
				subject: `Updated quotation ${quotation.reference} (v${version}) — ${quotation.projectName}`,
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

		return { sent, version };
	},
});
