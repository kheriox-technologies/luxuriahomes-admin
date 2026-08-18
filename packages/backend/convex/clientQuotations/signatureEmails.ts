'use node';

import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalAction } from '../_generated/server';
import { getPortalUrl } from '../clientPortal/shared';
import { getGmailConfig } from '../email/shared';
import {
	buildFullySignedEmail,
	buildRepresentativeSignatureEmail,
} from './emailContent';

/**
 * The Luxuria Homes inbox. Falls back the same way `notifyEnquiry` does, so a
 * deployment without the signature-specific address still reaches the office
 * rather than dropping the message.
 */
function adminRecipient(): string {
	return (
		process.env.LUXURIA_ADMIN_EMAIL?.trim() ||
		process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
		getGmailConfig().sender
	);
}

const SIGNED_DATE = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: 'Australia/Brisbane',
});

/** Sent by the workflow itself, so the log names the ceremony rather than a user. */
const SENT_BY = 'Signature workflow';

/**
 * Tells the office that every client has signed and only the countersignature is
 * outstanding.
 *
 * Internal and ungated: the last client to sign triggers it, and they are not an
 * admin — which is exactly why `email.sendInternal` exists.
 */
export const notifyRepresentative = internalAction({
	args: { quotationId: v.id('clientQuotations') },
	returns: v.null(),
	handler: async (ctx, args) => {
		const quotation = await ctx.runQuery(
			internal.clientQuotations.internal.getForSend,
			{ quotationId: args.quotationId }
		);

		const { html, text } = buildRepresentativeSignatureEmail(
			quotation,
			quotation.clients.map((client) => client.name),
			args.quotationId,
			getPortalUrl()
		);

		const signed = quotation.signedS3Key;
		const signedName = quotation.signedFileName;

		await ctx.runAction(internal.email.sendInternal.sendInternal, {
			to: [adminRecipient()],
			subject: `Countersignature needed — ${quotation.reference} (${quotation.projectName})`,
			html,
			text,
			attachments:
				signed && signedName
					? [
							{
								filename: signedName,
								contentType: 'application/pdf',
								s3Key: signed,
							},
						]
					: undefined,
			relatedTable: 'clientQuotations',
			relatedId: args.quotationId,
			sentBy: SENT_BY,
		});

		return null;
	},
});

/**
 * The closing message, once every party has signed.
 *
 * One email to the office and all clients together: they are party to the same
 * executed document, so — unlike the signing request, whose links are personal —
 * there is nothing here to keep apart.
 */
export const notifyFullySigned = internalAction({
	args: { quotationId: v.id('clientQuotations') },
	returns: v.null(),
	handler: async (ctx, args) => {
		const quotation = await ctx.runQuery(
			internal.clientQuotations.internal.getForSend,
			{ quotationId: args.quotationId }
		);

		const admin = adminRecipient();
		const clientEmails = quotation.clients
			.map((client) => client.email.trim())
			.filter((email) => email !== '');
		// De-duplicated in case the office is also named as a client.
		const to = [...new Set([admin, ...clientEmails])];

		const { html, text } = buildFullySignedEmail(
			quotation,
			SIGNED_DATE.format(quotation.updatedAt ?? Date.now())
		);

		const signed = quotation.signedS3Key;
		const signedName = quotation.signedFileName;

		await ctx.runAction(internal.email.sendInternal.sendInternal, {
			to,
			subject: `Signed quotation ${quotation.reference} — ${quotation.projectName}`,
			html,
			text,
			attachments:
				signed && signedName
					? [
							{
								filename: signedName,
								contentType: 'application/pdf',
								s3Key: signed,
							},
						]
					: undefined,
			relatedTable: 'clientQuotations',
			relatedId: args.quotationId,
			sentBy: SENT_BY,
		});

		return null;
	},
});
