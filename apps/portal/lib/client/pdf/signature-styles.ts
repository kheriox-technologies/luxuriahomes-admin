/**
 * The script faces a signer can sign a quotation in.
 *
 * Deliberately isomorphic: the same registry drives the style cards in the DOM
 * (via `cssFamily`, backed by the `@font-face` rules in app/portal-theme.css)
 * and the marks baked into the PDF (via `pdfFont`, registered with pdfmake by
 * `getPdfMakeWithSignatureFonts`). Both read the same TTF, so what a signer
 * previews is exactly what the document ends up carrying.
 *
 * The ids are mirrored by `quotationSignatureStyleValidator` in
 * packages/backend/convex/clientQuotations/shared.ts — adding a style means
 * editing both.
 */
export const SIGNATURE_STYLES = [
	{
		id: 'flowing',
		label: 'Flowing',
		cssFamily: 'Great Vibes',
		pdfFont: 'GreatVibes',
		file: 'GreatVibes-Regular.ttf',
	},
	{
		id: 'casual',
		label: 'Casual',
		cssFamily: 'Dancing Script',
		pdfFont: 'DancingScript',
		file: 'DancingScript-Regular.ttf',
	},
	{
		id: 'hand',
		label: 'Handwritten',
		cssFamily: 'Caveat',
		pdfFont: 'Caveat',
		file: 'Caveat-Regular.ttf',
	},
] as const;

export type SignatureStyle = (typeof SIGNATURE_STYLES)[number];
export type SignatureStyleId = SignatureStyle['id'];

export const DEFAULT_SIGNATURE_STYLE: SignatureStyleId = 'flowing';

const STYLES_BY_ID = new Map<string, SignatureStyle>(
	SIGNATURE_STYLES.map((style) => [style.id, style])
);

/** Falls back to the default rather than throwing, so a stale id still renders. */
export function signatureStyle(id: string | undefined): SignatureStyle {
	return (
		STYLES_BY_ID.get(id ?? '') ??
		(STYLES_BY_ID.get(DEFAULT_SIGNATURE_STYLE) as SignatureStyle)
	);
}

export function isSignatureStyleId(id: string): id is SignatureStyleId {
	return STYLES_BY_ID.has(id);
}

const INITIALS_SEPARATOR_REGEX = /[\s-]+/;
const MAX_INITIALS = 4;

/** 'Jane A. Whitmore' → 'JAW'. A starting point the signer can overtype. */
export function deriveInitials(name: string): string {
	return name
		.trim()
		.split(INITIALS_SEPARATOR_REGEX)
		.map((part) => part.replace(/[^\p{L}]/gu, '').charAt(0))
		.filter((letter) => letter.length > 0)
		.slice(0, MAX_INITIALS)
		.join('')
		.toUpperCase();
}
