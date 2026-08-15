/**
 * Renders a branded HTML email signature from structured fields.
 *
 * This module is intentionally pure (no Convex imports) so the portal can
 * import it for the live preview while the mutations use it to derive the
 * stored `content`. Keeping a single renderer guarantees the preview and the
 * signature that actually ships in emails can never drift apart.
 *
 * The markup is deliberately old-school — nested presentation tables and
 * inline styles only — because Gmail and Outlook strip `<style>` blocks and
 * ignore flexbox/grid.
 */

export const SIGNATURE_WEBSITE = 'https://luxuriahomes.com.au';
export const SIGNATURE_COMPANY = 'Luxuria Homes';
/** QBCC licensees must show their licence number on advertising material. */
export const SIGNATURE_QBCC_LICENCE = '15405403';

/**
 * The ink wordmark on a transparent background — the same logo the sidebar
 * renders, and the only variant that stays legible on the linen banner.
 * (`NEXT_PUBLIC_EMAIL_LOGO` is the cream variant, built for the dark header of
 * transactional emails, so it is invisible here.)
 *
 * Hard-coded rather than read from the env so the live preview and the stored
 * HTML can never point at different files.
 */
export const SIGNATURE_LOGO_URL =
	'https://static.luxuriahomes.com.au/images/lh-admin-logo-pdf.png';

/** Brand palette (linen / ink) shared with the app theme. */
const LINEN = '#f5ebe0';
const INK = '#2b2927';
const INK_LIGHT = '#514e4a';
/** Darkened from the app's muted tone to clear 4.5:1 against linen. */
const MUTED = '#6b645c';
/** Deep enough to stay visible against the linen card. */
const DIVIDER = '#ddd1c2';
const FONT_STACK = 'Arial, Helvetica, sans-serif';

export interface EmailSignatureFields {
	address?: string;
	company?: string;
	designation?: string;
	disclaimer?: string;
	email?: string;
	fullName: string;
	mobile?: string;
	phone?: string;
	qbccLicence?: string;
	tagline?: string;
	website: string;
}

export interface RenderSignatureOptions {
	logoUrl?: string;
}

/** Escapes the few HTML-significant characters for attribute/text values. */
function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function clean(value: string | undefined): string {
	return value?.trim() ?? '';
}

/** Strips the protocol so the website reads as `luxuriahomes.com.au`. */
const PROTOCOL_REGEX = /^https?:\/\//i;
const TRAILING_SLASH_REGEX = /\/+$/;
const WHITESPACE_REGEX = /\s+/g;

function displayUrl(url: string): string {
	return url.replace(PROTOCOL_REGEX, '').replace(TRAILING_SLASH_REGEX, '');
}

function withProtocol(url: string): string {
	return PROTOCOL_REGEX.test(url) ? url : `https://${url}`;
}

function link(href: string, label: string): string {
	return `<a href="${escapeHtml(href)}" style="color:${INK};text-decoration:none;">${escapeHtml(label)}</a>`;
}

/**
 * A `Label value` contact entry, e.g. `M 0400 000 000`. The trailing separator
 * is kept inside the nowrap span so a wrapped line never starts with a
 * dangling divider.
 */
function contactEntry(label: string, valueHtml: string, suffix = ''): string {
	return `<span style="white-space:nowrap;"><span style="color:${MUTED};font-weight:bold;">${label}</span>&nbsp;${valueHtml}${suffix}</span>`;
}

function buildBanner(fields: EmailSignatureFields, logoUrl: string): string {
	const company = clean(fields.company) || SIGNATURE_COMPANY;
	const designationLine = [clean(fields.designation), company]
		.filter(Boolean)
		.map((part) => escapeHtml(part))
		.join(' &middot; ');
	const tagline = clean(fields.tagline);

	// `width` is set alongside `height` because Outlook ignores `width:auto`.
	// The 1px cell is the vertical divider — a background-filled cell stretches
	// to the row height on its own, which `border-right` does not do reliably
	// across clients.
	const logoCell = logoUrl
		? `<td style="padding:0 16px 0 0;vertical-align:middle;" valign="middle"><img alt="${escapeHtml(company)}" height="40" src="${escapeHtml(logoUrl)}" style="display:block;border:0;outline:none;text-decoration:none;height:40px;width:100px;" width="100" /></td><td style="width:1px;background:${DIVIDER};font-size:0;line-height:0;" width="1">&nbsp;</td>`
		: '';

	const nameLine = `<div style="font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:${INK};line-height:1.3;">${escapeHtml(clean(fields.fullName))}</div>`;
	const designationHtml = designationLine
		? `<div style="font-family:${FONT_STACK};font-size:13px;color:${INK_LIGHT};line-height:1.5;padding-top:2px;">${designationLine}</div>`
		: '';
	const taglineHtml = tagline
		? `<div style="font-family:${FONT_STACK};font-size:12px;font-style:italic;color:${MUTED};line-height:1.5;padding-top:4px;">${escapeHtml(tagline)}</div>`
		: '';

	const detailsPadding = logoCell ? 'padding-left:16px;' : '';

	return `<tr><td style="background:${LINEN};border-bottom:1px solid ${DIVIDER};padding:16px 20px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${logoCell}<td style="${detailsPadding}vertical-align:middle;" valign="middle">${nameLine}${designationHtml}${taglineHtml}</td></tr></table>
</td></tr>`;
}

function buildContacts(fields: EmailSignatureFields): string {
	const entries: { label: string; valueHtml: string }[] = [];

	const mobile = clean(fields.mobile);
	if (mobile) {
		entries.push({
			label: 'M',
			valueHtml: link(`tel:${mobile.replace(WHITESPACE_REGEX, '')}`, mobile),
		});
	}

	const phone = clean(fields.phone);
	if (phone) {
		entries.push({
			label: 'P',
			valueHtml: link(`tel:${phone.replace(WHITESPACE_REGEX, '')}`, phone),
		});
	}

	const email = clean(fields.email);
	if (email) {
		entries.push({ label: 'E', valueHtml: link(`mailto:${email}`, email) });
	}

	const website = clean(fields.website) || SIGNATURE_WEBSITE;
	entries.push({
		label: 'W',
		valueHtml: link(withProtocol(website), displayUrl(website)),
	});

	const separator = `<span style="color:${DIVIDER};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`;
	const contactsHtml = entries
		.map((entry, index) =>
			contactEntry(
				entry.label,
				entry.valueHtml,
				index === entries.length - 1 ? '' : separator
			)
		)
		.join('');

	const address = clean(fields.address);
	const addressHtml = address
		? `<div style="padding-top:6px;color:${INK_LIGHT};">${escapeHtml(address)}</div>`
		: '';

	return `<tr><td style="background:${LINEN};padding:14px 20px;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${INK_LIGHT};">${contactsHtml}${addressHtml}</td></tr>`;
}

/**
 * The fine-print row: the optional disclaimer plus the QBCC licence, which is a
 * compliance line and so always renders.
 */
function buildFinePrint(fields: EmailSignatureFields): string {
	const disclaimer = clean(fields.disclaimer);
	const licence = clean(fields.qbccLicence) || SIGNATURE_QBCC_LICENCE;

	const disclaimerHtml = disclaimer
		? `<div style="color:${MUTED};">${escapeHtml(disclaimer)}</div>`
		: '';
	const licenceHtml = `<div style="color:${INK_LIGHT};${disclaimerHtml ? 'padding-top:6px;' : ''}">QBCC Licence No. ${escapeHtml(licence)}</div>`;

	return `<tr><td style="background:${LINEN};border-top:1px solid ${DIVIDER};padding:10px 20px 14px;font-family:${FONT_STACK};font-size:11px;line-height:1.5;">${disclaimerHtml}${licenceHtml}</td></tr>`;
}

/** Builds the full signature HTML fragment for a set of structured fields. */
export function renderSignatureHtml(
	fields: EmailSignatureFields,
	options: RenderSignatureOptions = {}
): string {
	const logoUrl = options.logoUrl ?? SIGNATURE_LOGO_URL;
	return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:520px;width:100%;background:${LINEN};border:1px solid ${DIVIDER};border-radius:6px;overflow:hidden;">
${buildBanner(fields, logoUrl)}
${buildContacts(fields)}
${buildFinePrint(fields)}
</table>`;
}
