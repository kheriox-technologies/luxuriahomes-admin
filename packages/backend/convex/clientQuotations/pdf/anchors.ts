/**
 * Where the signing boxes land on the rendered document.
 *
 * Split out from the document definition so the signing UI can type the anchors
 * the renderer hands back without importing the builder — which would drag the
 * HTML parser and the embedded typefaces into a browser bundle for the sake of
 * an interface.
 */

// Node ids must be unique across the document, so the signing boxes are
// namespaced by prefix and matched that way in `pageBreakBefore`.
export const SIGNATURE_ANCHOR_PREFIX = 'lhsig-';

export function initialsAnchorId(section: number, slotKey: string): string {
	return `${SIGNATURE_ANCHOR_PREFIX}initials-${section}-${slotKey}`;
}

export function signatureAnchorId(slotKey: string): string {
	return `${SIGNATURE_ANCHOR_PREFIX}signature-${slotKey}`;
}

/** One signing box, in PDF points from the page's top-left corner. */
export interface QuotationPdfAnchor {
	height: number;
	id: string;
	kind: 'initials' | 'signature';
	left: number;
	/** 1-based, matching the page numbering the PDF renderer uses. */
	page: number;
	/** Which numbered section the box closes; absent on the signature boxes. */
	section?: number;
	slotKey: string;
	top: number;
	width: number;
}
