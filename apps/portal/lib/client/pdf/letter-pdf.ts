import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { htmlToPdfmakeContent, type PdfBlock } from '@/lib/pdf/html-to-pdfmake';

export interface LetterRecipient {
	company?: string;
	name: string;
}

export interface LetterPdfInput {
	// Rich-text body as HTML (from the Tiptap editor).
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

const LETTERHEAD_URL = '/luxuria-letterhead.pdf';

const ROBOTO_VFS_FILES = {
	normal: 'Roboto-Regular.ttf',
	bold: 'Roboto-Medium.ttf',
	italics: 'Roboto-Italic.ttf',
	bolditalics: 'Roboto-MediumItalic.ttf',
} as const;

/**
 * pdfmake ships `vfs_fonts` as CJS `module.exports = { "Roboto-….ttf": "<base64>" }`.
 * Bundlers may expose that map on `import().default`, on the module namespace, or
 * split across both — taking the first object with any `.ttf` can yield a partial
 * vfs. Merge every `.ttf` entry we can find. (Mirrors project-inclusions-pdf.ts.)
 */
function mergeVirtualFontFilesFromModule(
	vfsModule: unknown
): Record<string, string> {
	const merged: Record<string, string> = {};

	function mergeFromObject(obj: unknown) {
		if (!obj || typeof obj !== 'object') {
			return;
		}
		for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
			if (
				!key.endsWith('.ttf') ||
				typeof val !== 'string' ||
				val.length === 0
			) {
				continue;
			}
			merged[key] = val;
		}
	}

	const mod = vfsModule as Record<string, unknown>;
	mergeFromObject(mod);
	mergeFromObject(mod.default);

	const defaultNested = mod.default as
		| { pdfMake?: { vfs?: unknown } }
		| undefined;
	mergeFromObject(defaultNested?.pdfMake?.vfs);

	const modNested = (mod as { pdfMake?: { vfs?: unknown } }).pdfMake?.vfs;
	mergeFromObject(modNested);

	return merged;
}

interface PdfMakeBrowser {
	addVirtualFileSystem: (
		vfs: Record<string, string | { data: string; encoding?: string }>
	) => void;
	createPdf: (docDefinition: unknown) => CreatedPdf;
	setFonts: (fonts: Record<string, Record<string, string>>) => void;
}

interface CreatedPdf {
	getBlob: () => Promise<Blob>;
}

/**
 * Browser `pdfmake` is a singleton that loads fonts from an internal virtual FS.
 * Assigning `pdfMake.vfs = …` does not register files — you must call
 * `addVirtualFileSystem` so `Roboto-Medium.ttf` etc. exist for the default font map.
 */
function configurePdfMakeFonts(
	pdfMake: PdfMakeBrowser,
	vfs: Record<string, string>
) {
	pdfMake.addVirtualFileSystem(vfs);

	const pick = (file: string, fallback: string) =>
		vfs[file] !== undefined && vfs[file] !== '' ? file : fallback;

	pdfMake.setFonts({
		Roboto: {
			normal: pick(ROBOTO_VFS_FILES.normal, ROBOTO_VFS_FILES.normal),
			bold: pick(ROBOTO_VFS_FILES.bold, ROBOTO_VFS_FILES.normal),
			italics: pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal),
			bolditalics: pick(
				ROBOTO_VFS_FILES.bolditalics,
				pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal)
			),
		},
	});
}

let pdfMakePromise: Promise<PdfMakeBrowser> | null = null;

function getPdfMake(): Promise<PdfMakeBrowser> {
	if (pdfMakePromise) {
		return pdfMakePromise;
	}
	pdfMakePromise = (async () => {
		const [{ default: pdfMake }, vfsModule] = await Promise.all([
			import('pdfmake/build/pdfmake'),
			import('pdfmake/build/vfs_fonts'),
		]);
		const vfs = mergeVirtualFontFilesFromModule(vfsModule);
		if (
			Object.keys(vfs).length === 0 ||
			typeof vfs[ROBOTO_VFS_FILES.normal] !== 'string' ||
			vfs[ROBOTO_VFS_FILES.normal] === ''
		) {
			throw new Error('Could not initialize PDF fonts.');
		}
		configurePdfMakeFonts(pdfMake as PdfMakeBrowser, vfs);
		return pdfMake as PdfMakeBrowser;
	})();
	return pdfMakePromise;
}

let letterheadBytesPromise: Promise<ArrayBuffer> | null = null;

function getLetterheadBytes(): Promise<ArrayBuffer> {
	if (letterheadBytesPromise) {
		return letterheadBytesPromise;
	}
	letterheadBytesPromise = (async () => {
		const response = await fetch(LETTERHEAD_URL);
		if (!response.ok) {
			throw new Error('Could not load the letterhead template.');
		}
		return response.arrayBuffer();
	})();
	return letterheadBytesPromise;
}

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

function buildDocDefinition(input: LetterPdfInput) {
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

async function buildContentPdfBytes(
	input: LetterPdfInput
): Promise<Uint8Array> {
	const pdfMake = await getPdfMake();
	const docDefinition = buildDocDefinition(input);
	const pdf = pdfMake.createPdf(docDefinition);
	const blob = await pdf.getBlob();
	return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Compose the letter. Page 1 uses the full letterhead (full header + its designed
 * footer). Continuation pages use the slim-header letterhead, but their baked
 * footer ("PAGE 2") is masked and the *exact* designed footer from page 1 is
 * re-stamped so every page carries the same footer from the PDF. A "Page X of Y"
 * line is drawn above the footer on every page.
 */
export async function buildLetterPdfBytes(
	input: LetterPdfInput
): Promise<Uint8Array> {
	const [contentBytes, letterheadBytes] = await Promise.all([
		buildContentPdfBytes(input),
		getLetterheadBytes(),
	]);

	const out = await PDFDocument.create();
	const font = await out.embedFont(StandardFonts.Helvetica);
	const contentDoc = await PDFDocument.load(contentBytes);
	const contentPages = await out.embedPages(contentDoc.getPages());

	const letterheadDoc = await PDFDocument.load(letterheadBytes);
	const letterheadPages = letterheadDoc.getPages();
	const firstPage = letterheadPages[0];
	const continuationPage = letterheadPages[letterheadPages.length > 1 ? 1 : 0];

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

	const pageCount = contentPages.length;
	for (let i = 0; i < pageCount; i++) {
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
		page.drawPage(contentPages[i], {
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

	return out.save();
}

export async function buildLetterPdfBlob(input: LetterPdfInput): Promise<Blob> {
	const bytes = await buildLetterPdfBytes(input);
	// Copy into a fresh ArrayBuffer so the Blob type is unambiguous.
	return new Blob([bytes.slice()], { type: 'application/pdf' });
}
