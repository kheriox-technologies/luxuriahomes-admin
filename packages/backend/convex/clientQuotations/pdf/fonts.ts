/**
 * The typefaces the quotation PDF is set in, as pdfmake font registrations.
 *
 * The portal fetches these from `/fonts/*.ttf` at render time; a Convex node
 * action has no origin to fetch from, so the TTFs are vendored as base64 in
 * `./fonts/` — the same approach `projectInclusions/pdf/logo.ts` takes for the
 * letterhead image. Regenerate them with:
 *
 *   node -e "…"  # see the header comment on any file in ./fonts
 *
 * Inter is the body face. Only *static* instances work: pdfkit ignores
 * variable-font axes and would silently render the thin default master.
 */

import type { PdfFontRegistration } from '../../projectInclusions/pdf/render';
import { SIGNATURE_STYLES } from '../signatureStyles';
import { CAVEAT_REGULAR_BASE64 } from './fonts/caveatRegular';
import { DANCING_SCRIPT_REGULAR_BASE64 } from './fonts/dancingScriptRegular';
import { GREAT_VIBES_REGULAR_BASE64 } from './fonts/greatVibesRegular';
import { INTER_REGULAR_BASE64 } from './fonts/interRegular';
import { INTER_SEMIBOLD_BASE64 } from './fonts/interSemiBold';

export const QUOTATION_BODY_FONT = 'Inter';

const INTER_REGULAR_FILE = 'Inter-Regular.ttf';
const INTER_SEMIBOLD_FILE = 'Inter-SemiBold.ttf';

const INTER: PdfFontRegistration = {
	family: QUOTATION_BODY_FONT,
	files: {
		[INTER_REGULAR_FILE]: INTER_REGULAR_BASE64,
		[INTER_SEMIBOLD_FILE]: INTER_SEMIBOLD_BASE64,
	},
	variants: {
		normal: INTER_REGULAR_FILE,
		bold: INTER_SEMIBOLD_FILE,
		// No italic static instance is vendored and the quotation never sets one,
		// so both italic slots point at the upright faces.
		italics: INTER_REGULAR_FILE,
		bolditalics: INTER_SEMIBOLD_FILE,
	},
};

const SIGNATURE_FONT_BASE64: Record<string, string> = {
	'GreatVibes-Regular.ttf': GREAT_VIBES_REGULAR_BASE64,
	'DancingScript-Regular.ttf': DANCING_SCRIPT_REGULAR_BASE64,
	'Caveat-Regular.ttf': CAVEAT_REGULAR_BASE64,
};

const SIGNATURE_FONTS: PdfFontRegistration[] = SIGNATURE_STYLES.map(
	(style) => ({
		family: style.pdfFont,
		files: { [style.file]: SIGNATURE_FONT_BASE64[style.file] as string },
		// Only a regular instance exists, and a signature never needs a bold or
		// italic one — every slot maps to the same face.
		variants: {
			normal: style.file,
			bold: style.file,
			italics: style.file,
			bolditalics: style.file,
		},
	})
);

/** Inter alone — enough for an unsigned quotation. */
export const QUOTATION_FONTS: readonly PdfFontRegistration[] = [INTER];

/** Inter plus the three script faces, for a document carrying signatures. */
export const QUOTATION_SIGNATURE_FONTS: readonly PdfFontRegistration[] = [
	INTER,
	...SIGNATURE_FONTS,
];

/**
 * Whether a style's face is available to this renderer. Always true today —
 * every vendored face is bundled — but the builder checks it for the same
 * reason the portal did: a signature set in the body font is a cosmetic loss,
 * while a failed render leaves the signer with nothing.
 */
export function isSignatureFontRegistered(pdfFont: string): boolean {
	return SIGNATURE_FONTS.some((font) => font.family === pdfFont);
}
