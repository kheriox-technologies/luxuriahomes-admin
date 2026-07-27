// Email helpers for the letter composer. Copied from the portal's
// `apps/portal/lib/email.ts` (the portal module can't be imported here — it
// pulls browser `File`/`FileReader`). Keep the branded body wrappers in sync so
// a letter emailed from mobile reads the same as one emailed from the portal.

import type { LetterRecipient } from '@/components/letters/letter-recipients-field';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;
const HTML_ENTITY_NBSP_REGEX = /&nbsp;/g;
const HTML_BLOCK_BREAK_REGEX = /<\/(p|div|li|h[1-6]|tr)>/gi;
const HTML_BR_REGEX = /<br\s*\/?>/gi;
const EXCESS_NEWLINES_REGEX = /\n{3,}/g;

// Default body used when a letter is emailed to its recipients on save (mirrors
// the portal's `DEFAULT_EMAIL_BODY_HTML`).
export const DEFAULT_EMAIL_BODY_HTML =
	'<p>Hello,</p><p>Luxuria Homes has shared a document with you. Please find it attached to this email.</p><p>Kind regards,<br/>Luxuria Homes</p>';

export function isValidEmail(value: string): boolean {
	return EMAIL_REGEX.test(value.trim());
}

// Valid, de-duplicated recipient emails (lowercased key) for the letter email.
export function collectRecipientEmails(
	recipients: LetterRecipient[]
): string[] {
	const byKey = new Map<string, string>();
	for (const recipient of recipients) {
		const email = recipient.email?.trim();
		if (!(email && isValidEmail(email))) {
			continue;
		}
		const key = email.toLowerCase();
		if (!byKey.has(key)) {
			byKey.set(key, email);
		}
	}
	return Array.from(byKey.values());
}

function htmlToText(value: string): string {
	return value
		.replace(HTML_BR_REGEX, '\n')
		.replace(HTML_BLOCK_BREAK_REGEX, '\n')
		.replace(HTML_TAG_REGEX, '')
		.replace(HTML_ENTITY_NBSP_REGEX, ' ')
		.replaceAll('&amp;', '&')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replace(EXCESS_NEWLINES_REGEX, '\n\n')
		.trim();
}

export function buildEmailHtml(bodyHtml: string): string {
	return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">${bodyHtml}</div>`;
}

export function buildEmailText(bodyHtml: string): string {
	return htmlToText(bodyHtml);
}
