import type { Doc, Id } from '@workspace/backend/dataModel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;
const HTML_ENTITY_NBSP_REGEX = /&nbsp;/g;
const HTML_BLOCK_BREAK_REGEX = /<\/(p|div|li|h[1-6]|tr)>/gi;
const HTML_BR_REGEX = /<br\s*\/?>/gi;
const EXCESS_NEWLINES_REGEX = /\n{3,}/g;

export interface RecipientSuggestion {
	email: string;
	label: string;
}

export interface ComposeAttachment {
	contentBase64?: string;
	contentType: string;
	filename: string;
	id: string;
	removable: boolean;
	s3Key?: string;
	storageId?: Id<'_storage'>;
}

export function isValidEmail(value: string): boolean {
	return EMAIL_REGEX.test(value.trim());
}

/**
 * Builds a deduplicated list of recipient suggestions from a project's clients
 * and its associated service providers (including each provider's contacts).
 */
export function buildRecipientSuggestions(
	project: Doc<'projects'> | null | undefined,
	serviceProviders: Doc<'serviceProviders'>[] | undefined
): RecipientSuggestion[] {
	const byEmail = new Map<string, RecipientSuggestion>();

	const addSuggestion = (email: string | undefined, label: string) => {
		const trimmed = email?.trim();
		if (!(trimmed && isValidEmail(trimmed))) {
			return;
		}
		const key = trimmed.toLowerCase();
		if (!byEmail.has(key)) {
			byEmail.set(key, { email: trimmed, label });
		}
	};

	for (const client of project?.clients ?? []) {
		const name = `${client.firstName} ${client.lastName}`.trim();
		addSuggestion(client.email, name || client.email);
	}

	for (const provider of serviceProviders ?? []) {
		addSuggestion(provider.email, `${provider.name} (${provider.company})`);
		for (const contact of provider.contacts) {
			addSuggestion(contact.email, `${contact.name} (${provider.company})`);
		}
	}

	return Array.from(byEmail.values()).sort((a, b) =>
		a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
	);
}

/** Converts an HTML fragment to a readable plain-text approximation. */
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

/**
 * Combines the rich-text (HTML) body with an optional HTML signature into a
 * single HTML email body.
 */
export function buildEmailHtml(
	bodyHtml: string,
	signatureHtml?: string
): string {
	const signature = signatureHtml ? `<br><br>${signatureHtml}` : '';
	return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">${bodyHtml}${signature}</div>`;
}

/** Builds the plain-text fallback from the HTML body and optional signature. */
export function buildEmailText(
	bodyHtml: string,
	signatureHtml?: string
): string {
	const bodyText = htmlToText(bodyHtml);
	const signatureText = signatureHtml ? htmlToText(signatureHtml) : '';
	return signatureText ? `${bodyText}\n\n${signatureText}` : bodyText;
}

/** Reads a File into a base64 string (without the data-URL prefix). */
export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result !== 'string') {
				reject(new Error('Could not read file'));
				return;
			}
			const commaIndex = result.indexOf(',');
			resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
		};
		reader.onerror = () =>
			reject(reader.error ?? new Error('Could not read file'));
		reader.readAsDataURL(file);
	});
}
