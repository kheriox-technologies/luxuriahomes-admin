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
const ADMIN_QUOTATIONS_PATH = '/quotations';

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

function buttonHtml(url: string, label: string): string {
	if (!url) {
		return '';
	}
	return `<p><a href="${escapeHtml(url)}" rel="noopener" style="display:inline-block;background:#111;color:#fff;font-weight:bold;text-decoration:none;padding:12px 20px;border-radius:6px;">${label}</a></p>`;
}

function ctaHtml(portalUrl: string, label: string): string {
	return buttonHtml(quotationsUrl(portalUrl), label);
}

function ctaText(portalUrl: string, label: string): string {
	const url = quotationsUrl(portalUrl);
	return url ? `\n${label}: ${url}\n` : '';
}

/** Where a client goes to sign; the admin countersigns from their own surface. */
function clientSigningUrl(portalUrl: string, quotationId: string): string {
	return portalUrl ? `${portalUrl}${QUOTATIONS_PATH}/${quotationId}/sign` : '';
}

function representativeSigningUrl(
	portalUrl: string,
	quotationId: string
): string {
	return portalUrl
		? `${portalUrl}${ADMIN_QUOTATIONS_PATH}/${quotationId}/sign`
		: '';
}

function linkText(url: string, label: string): string {
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
 * The email each client receives when signatures are requested.
 *
 * Sent individually rather than to everyone at once: the link opens that
 * client's own signing session, and the portal checks the signed-in address
 * against it, so a shared message would only confuse the other recipients.
 */
export function buildSignatureRequestEmail(
	quotation: QuotationEmailDetails,
	client: QuotationEmailClient,
	quotationId: string,
	portalUrl: string
): { html: string; text: string } {
	const greetingName = client.name.trim() || 'there';
	const total = AUD.format(quotation.totalInclGst);
	const url = clientSigningUrl(portalUrl, quotationId);

	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">
<p>Hi ${escapeHtml(greetingName)},</p>
<p>Your quotation <strong>${escapeHtml(quotation.reference)}</strong> for <strong>${escapeHtml(quotation.projectName)}</strong> has been approved and is ready to sign. The approved copy is attached for your records, totalling <strong>${total} incl. GST</strong>.</p>
<p>Signing takes a couple of minutes: choose how you'd like your signature to look, initial each section of the quotation, then sign the last page.</p>
${buttonHtml(url, 'Review and sign')}
<p>Please sign in with <strong>${escapeHtml(client.email)}</strong> &mdash; the link only opens for that address.</p>
<p>If anything still needs changing, contact us before signing using the details below.</p>
</div>`;

	const text = `Hi ${greetingName},

Your quotation ${quotation.reference} for ${quotation.projectName} has been approved and is ready to sign. The approved copy is attached for your records, totalling ${total} incl. GST.

Signing takes a couple of minutes: choose how you'd like your signature to look, initial each section of the quotation, then sign the last page.
${linkText(url, 'Review and sign')}
Please sign in with ${client.email} — the link only opens for that address.

If anything still needs changing, contact us before signing.`;

	return { html, text };
}

/**
 * The email the office receives once every client has signed and only the
 * countersignature is outstanding. The link lands on the admin surface, which
 * turns away anyone without the admin role.
 */
export function buildRepresentativeSignatureEmail(
	quotation: QuotationEmailDetails,
	clientNames: string[],
	quotationId: string,
	portalUrl: string
): { html: string; text: string } {
	const total = AUD.format(quotation.totalInclGst);
	const signed = clientNames.join(', ');
	const url = representativeSigningUrl(portalUrl, quotationId);

	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">
<p>All clients have signed quotation <strong>${escapeHtml(quotation.reference)}</strong> for <strong>${escapeHtml(quotation.projectName)}</strong> (${total} incl. GST).</p>
<p><strong>Signed by:</strong> ${escapeHtml(signed)}</p>
<p>It now needs a Luxuria Homes countersignature to complete. The part-signed copy is attached.</p>
${buttonHtml(url, 'Countersign the quotation')}
<p>You'll need to be signed in as an administrator to sign on behalf of Luxuria Homes.</p>
</div>`;

	const text = `All clients have signed quotation ${quotation.reference} for ${quotation.projectName} (${total} incl. GST).

Signed by: ${signed}

It now needs a Luxuria Homes countersignature to complete. The part-signed copy is attached.
${linkText(url, 'Countersign the quotation')}
You'll need to be signed in as an administrator to sign on behalf of Luxuria Homes.`;

	return { html, text };
}

/**
 * The single closing email, to the office and every client at once. Everyone is
 * party to the same executed document, so unlike the request there is nothing
 * recipient-specific to keep apart.
 */
export function buildFullySignedEmail(
	quotation: QuotationEmailDetails,
	signedAtLabel: string
): { html: string; text: string } {
	const total = AUD.format(quotation.totalInclGst);

	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">
<p>Hi all,</p>
<p>Quotation <strong>${escapeHtml(quotation.reference)}</strong> for <strong>${escapeHtml(quotation.projectName)}</strong> has been signed by all parties as at <strong>${escapeHtml(signedAtLabel)}</strong>.</p>
<p>The fully signed copy is attached for your records, totalling <strong>${total} incl. GST</strong>.</p>
<p>Thank you &mdash; we're looking forward to getting started.</p>
</div>`;

	const text = `Hi all,

Quotation ${quotation.reference} for ${quotation.projectName} has been signed by all parties as at ${signedAtLabel}.

The fully signed copy is attached for your records, totalling ${total} incl. GST.

Thank you — we're looking forward to getting started.`;

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
