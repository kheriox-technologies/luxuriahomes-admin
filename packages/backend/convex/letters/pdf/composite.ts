'use node';

// Server-side letter PDF pipeline. This is the node port of the browser-only
// `apps/portal/lib/client/pdf/letter-pdf.ts`: pdfmake renders the letter body,
// then pdf-lib composites it onto the branded letterhead. The pdf-lib logic is
// environment-agnostic and carried over verbatim (same calibrated constants);
// the only substitutions are the body renderer (`renderPdfToBuffer` instead of
// the browser `pdfMake.createPdf`) and the letterhead source (embedded bytes
// instead of `fetch('/luxuria-letterhead.pdf')`). Keep in sync with the portal
// so a letter renders identically in the preview and on the server.

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { renderPdfToBuffer } from '../../projectInclusions/pdf/render';
import { htmlToPdfmakeContent, type PdfBlock } from './htmlToPdfmake';
import { LETTERHEAD_PDF_BYTES } from './letterhead';

export interface LetterRecipient {
	company?: string;
	name: string;
}

export interface LetterPdfInput {
	// Rich-text body as HTML (from the Tiptap/TenTap editor).
	contentHtml: string;
	// Human-readable date line, e.g. "27 July 2026".
	dateLabel: string;
	// Rich-text closing/"From" block as HTML (defaults to Kind Regards / Luxuria Homes).
	fromHtml: string;
	recipients: LetterRecipient[];
}

// A4 in PDF points (matches the letterhead template's MediaBox of 595 × 842).
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// Content margins tuned to clear the letterhead's header (top) and footer
// (bottom) on both the first page and continuation pages. Calibrated against the
// live preview; adjust here if the letterhead art changes.
const PAGE_MARGINS: [number, number, number, number] = [64, 150, 64, 130];

// The letterhead's designed footer lives in the bottom band of page 1. We embed
// this bottom region and re-stamp it onto continuation pages so every page shows
// the exact same footer from the PDF (page 1 already has it). Calibrated to the
// letterhead art: the footer content spans ~y 45–78pt with a thin separator rule
// at ~y 97pt, so the region must reach above the rule to include it.
const FOOTER_REGION_HEIGHT = 104;
// White rectangle height that erases the continuation template's own baked footer
// (a rule + static "PAGE 2") before the real footer is stamped over it.
const CONTINUATION_FOOTER_MASK_HEIGHT = 104;
// Page number sits centered at the very bottom of the page, below the footer.
const PAGE_NUMBER_BASELINE_Y = 22;
const PAGE_NUMBER_FONT_SIZE = 8;
const FOOTER_TEXT_COLOR = rgb(0.42, 0.45, 0.5);

function recipientsBlock(recipients: LetterRecipient[]): PdfBlock {
	if (recipients.length === 0) {
		return { text: [{ text: ' ' }], margin: [0, 0, 0, 16] };
	}
	const stack: PdfBlock[] = recipients.map((recipient, index) => {
		const lines: PdfBlock[] = [
			{ text: [{ text: recipient.name, bold: true }], margin: [0, 0, 0, 0] },
		];
		const company = recipient.company?.trim();
		if (company) {
			lines.push({ text: [{ text: company }], margin: [0, 0, 0, 0] });
		}
		return {
			stack: lines,
			margin: [0, 0, 0, index < recipients.length - 1 ? 8 : 0],
		};
	});
	return { stack, margin: [0, 0, 0, 16] };
}

export function buildLetterDocDefinition(
	input: LetterPdfInput
): Record<string, unknown> {
	const contentNodes = htmlToPdfmakeContent(input.contentHtml);
	const fromNodes = htmlToPdfmakeContent(input.fromHtml);

	return {
		pageSize: 'A4',
		pageMargins: PAGE_MARGINS,
		defaultStyle: {
			font: 'Roboto',
			fontSize: 11,
			lineHeight: 1.35,
			color: '#111827',
		},
		content: [
			{ text: input.dateLabel, margin: [0, 0, 0, 18] },
			{ text: 'To,', bold: true, margin: [0, 0, 0, 4] },
			recipientsBlock(input.recipients),
			...contentNodes,
			{
				// Keep the closing together and never split across a page break.
				unbreakable: true,
				stack: fromNodes,
				margin: [0, 28, 0, 0],
			},
		],
	};
}

/**
 * Build the finished letter PDF as a Buffer. Page 1 uses the full letterhead
 * (full header + its designed footer). Continuation pages use the slim-header
 * letterhead, but their baked footer ("PAGE 2") is masked and the *exact*
 * designed footer from page 1 is re-stamped so every page carries the same
 * footer. A "Page X of Y" line is drawn above the footer on every page.
 */
export async function buildLetterPdfBuffer(
	input: LetterPdfInput
): Promise<Buffer> {
	const contentBuffer = await renderPdfToBuffer(
		buildLetterDocDefinition(input)
	);

	const out = await PDFDocument.create();
	const font = await out.embedFont(StandardFonts.Helvetica);
	const contentDoc = await PDFDocument.load(contentBuffer);
	const contentPages = await out.embedPages(contentDoc.getPages());

	const letterheadDoc = await PDFDocument.load(LETTERHEAD_PDF_BYTES);
	const letterheadPages = letterheadDoc.getPages();
	const firstPage = letterheadPages[0];
	if (!firstPage) {
		throw new Error('Letterhead template has no pages.');
	}
	const continuationPage =
		letterheadPages[letterheadPages.length > 1 ? 1 : 0] ?? firstPage;

	// Full-page embeds for the backgrounds, plus a clipped embed of page 1's
	// bottom band — the designed footer — to re-stamp onto continuation pages.
	const [letterheadFirst, letterheadContinuation] = await out.embedPages([
		firstPage,
		continuationPage,
	]);
	const [footerStamp] = await out.embedPages(
		[firstPage],
		[{ left: 0, bottom: 0, right: A4_WIDTH, top: FOOTER_REGION_HEIGHT }]
	);
	if (!(letterheadFirst && letterheadContinuation && footerStamp)) {
		throw new Error('Failed to embed the letterhead pages.');
	}

	const pageCount = contentPages.length;
	for (let i = 0; i < pageCount; i++) {
		const contentPage = contentPages[i];
		if (!contentPage) {
			continue;
		}
		const page = out.addPage([A4_WIDTH, A4_HEIGHT]);
		if (i === 0) {
			// Page 1: full letterhead as-is (header + real designed footer).
			page.drawPage(letterheadFirst, {
				x: 0,
				y: 0,
				width: A4_WIDTH,
				height: A4_HEIGHT,
			});
		} else {
			// Continuation: slim-header letterhead, mask its baked footer, then
			// stamp the real designed footer from page 1.
			page.drawPage(letterheadContinuation, {
				x: 0,
				y: 0,
				width: A4_WIDTH,
				height: A4_HEIGHT,
			});
			page.drawRectangle({
				x: 0,
				y: 0,
				width: A4_WIDTH,
				height: CONTINUATION_FOOTER_MASK_HEIGHT,
				color: rgb(1, 1, 1),
			});
			page.drawPage(footerStamp, {
				x: 0,
				y: 0,
				width: A4_WIDTH,
				height: FOOTER_REGION_HEIGHT,
			});
		}

		// Letter body/closing on top.
		page.drawPage(contentPage, {
			x: 0,
			y: 0,
			width: A4_WIDTH,
			height: A4_HEIGHT,
		});

		// Page number, centered at the bottom of every page.
		const label = `Page ${i + 1} of ${pageCount}`;
		const labelWidth = font.widthOfTextAtSize(label, PAGE_NUMBER_FONT_SIZE);
		page.drawText(label, {
			x: (A4_WIDTH - labelWidth) / 2,
			y: PAGE_NUMBER_BASELINE_Y,
			size: PAGE_NUMBER_FONT_SIZE,
			font,
			color: FOOTER_TEXT_COLOR,
		});
	}

	const bytes = await out.save();
	return Buffer.from(bytes);
}
