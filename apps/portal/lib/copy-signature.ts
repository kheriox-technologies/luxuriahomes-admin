/**
 * Copies a signature to the clipboard as rich text.
 *
 * Writing the `text/html` flavour is what makes Gmail (and Outlook, Apple
 * Mail, …) paste the *rendered* signature rather than raw markup.
 */

const HTML_TAG_REGEX = /<[^>]*>/g;
const HTML_BR_REGEX = /<br\s*\/?>/gi;
const HTML_BLOCK_BREAK_REGEX = /<\/(p|div|li|h[1-6]|tr)>/gi;
const HTML_ENTITY_NBSP_REGEX = /&nbsp;/g;
const EXCESS_NEWLINES_REGEX = /\n{3,}/g;

/** Plain-text flavour so pasting into a plain-text field still reads well. */
function htmlToText(value: string): string {
	return value
		.replace(HTML_BR_REGEX, '\n')
		.replace(HTML_BLOCK_BREAK_REGEX, '\n')
		.replace(HTML_TAG_REGEX, '')
		.replace(HTML_ENTITY_NBSP_REGEX, ' ')
		.replaceAll('&amp;', '&')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&middot;', '·')
		.replace(EXCESS_NEWLINES_REGEX, '\n\n')
		.trim();
}

/**
 * Legacy path for browsers without `ClipboardItem`: select an off-screen
 * contentEditable node and let the browser serialise the selection itself.
 */
function copyViaSelection(html: string): boolean {
	const holder = document.createElement('div');
	holder.contentEditable = 'true';
	holder.innerHTML = html;
	holder.setAttribute(
		'style',
		'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;'
	);
	document.body.appendChild(holder);

	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(holder);
	selection?.removeAllRanges();
	selection?.addRange(range);

	let copied = false;
	try {
		copied = document.execCommand('copy');
	} finally {
		selection?.removeAllRanges();
		holder.remove();
	}
	return copied;
}

/** Puts the rendered signature on the clipboard. Throws if it could not. */
export async function copySignatureToClipboard(html: string): Promise<void> {
	const text = htmlToText(html);

	if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					'text/html': new Blob([html], { type: 'text/html' }),
					'text/plain': new Blob([text], { type: 'text/plain' }),
				}),
			]);
			return;
		} catch {
			// Permission denied or unsupported flavour — fall through.
		}
	}

	if (!copyViaSelection(html)) {
		throw new Error('Clipboard access was blocked by the browser');
	}
}
