'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import {
	buildRawMessage,
	getGmailAccessToken,
	getGmailConfig,
	sendGmailMessage,
} from './shared';
import {
	appendBrandedText,
	getEmailBranding,
	wrapBrandedHtml,
} from './template';

const NEWLINE_REGEX = /\n/g;

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function row(label: string, value: string): string {
	return `<tr><td style="padding:6px 12px 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#71717a;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#18181b;">${value}</td></tr>`;
}

/**
 * Sends an admin notification when a marketing-site contact form is submitted.
 * Scheduled (fire-and-forget) by `web/leads.submitEnquiry`. Unlike
 * `email/send.send`, this is NOT admin-gated — the public form triggers it.
 */
export const notifyEnquiry = internalAction({
	args: {
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		phone: v.optional(v.string()),
		message: v.string(),
	},
	returns: v.null(),
	handler: async (_ctx, args) => {
		const config = getGmailConfig();
		const accessToken = await getGmailAccessToken(config);
		const branding = getEmailBranding();

		const recipient =
			process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || config.sender;
		const fullName = `${args.firstName} ${args.lastName}`.trim();

		const bodyHtml = `
			<h2 style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:18px;color:#18181b;">New website enquiry</h2>
			<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#71717a;">A new enquiry was submitted through the Luxuria Homes website contact form.</p>
			<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
				${row('Name', escapeHtml(fullName))}
				${row('Email', `<a href="mailto:${escapeHtml(args.email)}" style="color:#15283a;">${escapeHtml(args.email)}</a>`)}
				${args.phone ? row('Phone', `<a href="tel:${escapeHtml(args.phone)}" style="color:#15283a;">${escapeHtml(args.phone)}</a>`) : ''}
				${row('Message', escapeHtml(args.message).replace(NEWLINE_REGEX, '<br>'))}
			</table>`;

		const bodyText = [
			'New website enquiry',
			'',
			`Name: ${fullName}`,
			`Email: ${args.email}`,
			args.phone ? `Phone: ${args.phone}` : null,
			'',
			'Message:',
			args.message,
		]
			.filter((line) => line !== null)
			.join('\n');

		const raw = await buildRawMessage({
			from: config.sender,
			to: [recipient],
			subject: `New website enquiry from ${fullName}`,
			html: wrapBrandedHtml(bodyHtml, branding),
			text: appendBrandedText(bodyText, branding),
			attachments: [],
		});

		await sendGmailMessage(accessToken, raw);
		return null;
	},
});
