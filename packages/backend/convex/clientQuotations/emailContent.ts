/**
 * Bodies for the emails a quotation sends its clients.
 *
 * Kept pure — no Convex or Node imports — so both the initial send and the
 * revision notice read from one place and can be reasoned about on their own.
 * The branded shell (logo, contact footer) is added by `email.send`, so these
 * are bodies only. The portal origin is passed in rather than read from the
 * environment here, which is what keeps this module free of Node.
 */

const QUOTATIONS_PATH = '/client/quotations';

const AUD = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	maximumFractionDigits: 0,
});

/** Escapes the few HTML-significant characters for use in text nodes. */
export function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function quotationsUrl(portalUrl: string): string {
	return portalUrl ? `${portalUrl}${QUOTATIONS_PATH}` : '';
}

function ctaHtml(portalUrl: string, label: string): string {
	const url = quotationsUrl(portalUrl);
	if (!url) {
		return '';
	}
	return `<p><a href="${escapeHtml(url)}" rel="noopener" style="display:inline-block;background:#111;color:#fff;font-weight:bold;text-decoration:none;padding:12px 20px;border-radius:6px;">${label}</a></p>`;
}

function ctaText(portalUrl: string, label: string): string {
	const url = quotationsUrl(portalUrl);
	return url ? `\n${label}: ${url}\n` : '';
}

/** What every one of these emails closes with: notes, contact, approval. */
const NEXT_STEPS_HTML = `<p>Once you're signed in you can open the quotation PDF and <strong>add a note</strong> against it if you'd like anything clarified or changed &mdash; we'll be notified as soon as you do. You're also very welcome to contact us directly using the details below.</p>
<p>If you're happy with everything, you can <strong>approve the quotation</strong> from the portal.</p>`;

const NEXT_STEPS_TEXT = `Once you're signed in you can open the quotation PDF and add a note against it if you'd like anything clarified or changed — we'll be notified as soon as you do. You're also very welcome to contact us directly.

If you're happy with everything, you can approve the quotation from the portal.`;

export interface QuotationEmailClient {
	email: string;
	name: string;
}

export interface QuotationEmailDetails {
	projectName: string;
	reference: string;
	totalInclGst: number;
}

/** Credentials for a client whose portal account was created by this send. */
export interface NewAccount {
	password: string;
}

/**
 * The email a client receives when a quotation is first issued to them.
 *
 * The credentials block only appears when this send created the account — a
 * client who already had a login gets the link on its own.
 */
export function buildQuotationEmail(
	quotation: QuotationEmailDetails,
	client: QuotationEmailClient,
	account: NewAccount | null,
	portalUrl: string
): { html: string; text: string } {
	const greetingName = client.name.trim() || 'there';
	const total = AUD.format(quotation.totalInclGst);

	const credentialsHtml = account
		? `<p>To review it online you'll need to sign in. We've created an account for you:</p>
<p><strong>Email:</strong> ${escapeHtml(client.email)}<br><strong>Temporary password:</strong> ${escapeHtml(account.password)}</p>
<p>You can also sign in with <strong>Google</strong> using this same email address (${escapeHtml(client.email)}) &mdash; no password needed.</p>
<p>For your security, please change your password after signing in.</p>`
		: '<p>Sign in to the client portal with your existing account to review it online.</p>';

	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">
<p>Hi ${escapeHtml(greetingName)},</p>
<p>Please find attached your quotation <strong>${escapeHtml(quotation.reference)}</strong> for <strong>${escapeHtml(quotation.projectName)}</strong>, totalling <strong>${total} incl. GST</strong>.</p>
${credentialsHtml}
${ctaHtml(portalUrl, 'View your quotation')}
${NEXT_STEPS_HTML}
<p>We look forward to hearing from you.</p>
</div>`;

	const credentialsText = account
		? `To review it online you'll need to sign in. We've created an account for you:

Email: ${client.email}
Temporary password: ${account.password}

You can also sign in with Google using this same email address (${client.email}) — no password needed.
For your security, please change your password after signing in.`
		: 'Sign in to the client portal with your existing account to review it online.';

	const text = `Hi ${greetingName},

Please find attached your quotation ${quotation.reference} for ${quotation.projectName}, totalling ${total} incl. GST.

${credentialsText}
${ctaText(portalUrl, 'View your quotation')}
${NEXT_STEPS_TEXT}

We look forward to hearing from you.`;

	return { html, text };
}

/**
 * The email a client receives when a new version of a quotation they already
 * hold is issued. It leads with what changed, because that — not the quotation
 * itself — is the news.
 */
export function buildQuotationVersionEmail(
	quotation: QuotationEmailDetails,
	client: QuotationEmailClient,
	version: { description: string; number: number },
	portalUrl: string
): { html: string; text: string } {
	const greetingName = client.name.trim() || 'there';
	const total = AUD.format(quotation.totalInclGst);

	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">
<p>Hi ${escapeHtml(greetingName)},</p>
<p>We've issued an updated quotation for <strong>${escapeHtml(quotation.projectName)}</strong>. Version ${version.number} of <strong>${escapeHtml(quotation.reference)}</strong> is attached, and it replaces the copy you had.</p>
<p><strong>What changed:</strong> ${escapeHtml(version.description)}</p>
<p>The revised total is <strong>${total} incl. GST</strong>.</p>
${ctaHtml(portalUrl, 'View the updated quotation')}
${NEXT_STEPS_HTML}
<p>We look forward to hearing from you.</p>
</div>`;

	const text = `Hi ${greetingName},

We've issued an updated quotation for ${quotation.projectName}. Version ${version.number} of ${quotation.reference} is attached, and it replaces the copy you had.

What changed: ${version.description}

The revised total is ${total} incl. GST.
${ctaText(portalUrl, 'View the updated quotation')}
${NEXT_STEPS_TEXT}

We look forward to hearing from you.`;

	return { html, text };
}
