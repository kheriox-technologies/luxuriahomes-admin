/**
 * Branded email shell shared by every email the app sends.
 *
 * This module is intentionally pure (no Convex/Node imports) so it can be unit
 * tested and reasoned about in isolation. The `send` action wraps each email's
 * HTML/text body with this shell, so all senders are branded consistently
 * without per-caller changes.
 */

export interface EmailBranding {
	appName: string;
	contactAddress: string;
	contactEmail: string;
	contactPhone: string;
	foregroundColor: string;
	logoUrl: string;
	primaryColor: string;
	webUrl: string;
}

const DEFAULT_PRIMARY_COLOR = '#111111';
const DEFAULT_FOREGROUND_COLOR = '#ffffff';
const DEFAULT_APP_NAME = 'Luxuria Homes';

/** Matches the literal escape sequence `\n` stored in address env vars. */
const LITERAL_NEWLINE_REGEX = /\\n/g;

function envOrEmpty(value: string | undefined): string {
	return value?.trim() ?? '';
}

/**
 * Reads branding values from the Convex deployment env. Missing values degrade
 * gracefully (empty strings / sensible defaults) so sending never breaks.
 */
export function getEmailBranding(): EmailBranding {
	return {
		primaryColor:
			envOrEmpty(process.env.NEXT_PUBLIC_APP_PRIMARY_COLOR) ||
			DEFAULT_PRIMARY_COLOR,
		foregroundColor:
			envOrEmpty(process.env.NEXT_PUBLIC_APP_PRIMARY_FOREGROUND_COLOR) ||
			DEFAULT_FOREGROUND_COLOR,
		logoUrl: envOrEmpty(process.env.NEXT_PUBLIC_EMAIL_LOGO),
		appName: envOrEmpty(process.env.NEXT_PUBLIC_APP_NAME) || DEFAULT_APP_NAME,
		webUrl: envOrEmpty(process.env.NEXT_PUBLIC_WEB_URL),
		contactEmail: envOrEmpty(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
		contactPhone: envOrEmpty(process.env.NEXT_PUBLIC_CONTACT_PHONE),
		contactAddress: envOrEmpty(process.env.NEXT_PUBLIC_CONTACT_ADDRESS),
	};
}

/** Escapes the few HTML-significant characters for use in attribute/text values. */
function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function buildHeader(branding: EmailBranding): string {
	const logoOrName = branding.logoUrl
		? `<img alt="${escapeHtml(branding.appName)}" src="${escapeHtml(branding.logoUrl)}" style="display:inline-block;height:40px;max-height:40px;width:auto;border:0;outline:none;text-decoration:none;" />`
		: `<span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:${branding.foregroundColor};">${escapeHtml(branding.appName)}</span>`;

	return `<tr><td align="center" style="background:${branding.primaryColor};padding:24px;">${logoOrName}</td></tr>`;
}

function buildBody(bodyHtml: string): string {
	return `<tr><td style="padding:24px;">${bodyHtml}</td></tr>`;
}

function buildFooter(branding: EmailBranding): string {
	const lines: string[] = [];

	if (branding.webUrl) {
		const safeUrl = escapeHtml(branding.webUrl);
		lines.push(
			`<a href="${safeUrl}" rel="noopener" style="color:#555555;text-decoration:none;">${safeUrl}</a>`
		);
	}
	if (branding.contactEmail) {
		const safeEmail = escapeHtml(branding.contactEmail);
		lines.push(
			`<a href="mailto:${safeEmail}" style="color:#555555;text-decoration:none;">${safeEmail}</a>`
		);
	}
	if (branding.contactPhone) {
		lines.push(escapeHtml(branding.contactPhone));
	}
	if (branding.contactAddress) {
		lines.push(
			escapeHtml(branding.contactAddress).replace(LITERAL_NEWLINE_REGEX, '<br>')
		);
	}

	const contactBlock = lines.join('<br>');
	const copyright = `&copy; ${escapeHtml(branding.appName)}`;

	return `<tr><td align="center" style="background:#f4f4f5;padding:20px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#555555;">${contactBlock}${contactBlock ? '<br><br>' : ''}${copyright}</td></tr>`;
}

/** Wraps an email body fragment in the branded header/body/footer shell. */
export function wrapBrandedHtml(
	bodyHtml: string,
	branding: EmailBranding
): string {
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;margin:0;padding:24px 0;width:100%;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
${buildHeader(branding)}
${buildBody(bodyHtml)}
${buildFooter(branding)}
</table>
</td></tr>
</table>`;
}

/** Appends a plain-text contact footer so the text fallback stays branded. */
export function appendBrandedText(
	bodyText: string,
	branding: EmailBranding
): string {
	const lines: string[] = [];

	if (branding.webUrl) {
		lines.push(branding.webUrl);
	}
	if (branding.contactEmail) {
		lines.push(branding.contactEmail);
	}
	if (branding.contactPhone) {
		lines.push(branding.contactPhone);
	}
	if (branding.contactAddress) {
		lines.push(branding.contactAddress.replace(LITERAL_NEWLINE_REGEX, '\n'));
	}

	const footer = [...lines, `© ${branding.appName}`].join('\n');
	return `${bodyText}\n\n--\n${footer}`;
}
