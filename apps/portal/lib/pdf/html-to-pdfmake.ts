// Converts the HTML emitted by the Tiptap `RichTextEditor` into pdfmake content
// nodes. The editor uses StarterKit, so besides the toolbar-exposed marks
// (bold / italic / underline / strike / link) and lists, markdown input rules
// can also produce headings and blockquotes — all handled here.
//
// Browser-only: relies on `DOMParser`.

export interface PdfTextRun {
	bold?: boolean;
	color?: string;
	decoration?: 'underline' | 'lineThrough';
	italics?: boolean;
	link?: string;
	text: string;
}

type Margin = [number, number, number, number];

export interface PdfParagraph {
	fontSize?: number;
	margin?: Margin;
	text: (string | PdfTextRun)[];
}

export interface PdfList {
	margin?: Margin;
	ol?: PdfListItem[];
	ul?: PdfListItem[];
}

export interface PdfStack {
	margin?: Margin;
	stack: PdfBlock[];
}

export type PdfBlock = PdfParagraph | PdfList | PdfStack;
type PdfListItem = PdfParagraph | PdfStack;

const HEADING_TAG = /^h([1-6])$/;
const LINK_COLOR = '#2563eb';
const PARAGRAPH_MARGIN: Margin = [0, 0, 0, 8];
const BLOCKQUOTE_MARGIN: Margin = [12, 0, 0, 8];

// Heading font sizes by level (StarterKit supports h1–h6).
const HEADING_FONT_SIZES: Record<number, number> = {
	1: 20,
	2: 16,
	3: 14,
	4: 12,
	5: 11,
	6: 10,
};

interface ActiveMarks {
	bold?: boolean;
	italics?: boolean;
	link?: string;
	strike?: boolean;
	underline?: boolean;
}

function makeRun(text: string, marks: ActiveMarks): PdfTextRun {
	const run: PdfTextRun = { text };
	if (marks.bold) {
		run.bold = true;
	}
	if (marks.italics) {
		run.italics = true;
	}
	if (marks.underline) {
		run.decoration = 'underline';
	} else if (marks.strike) {
		run.decoration = 'lineThrough';
	}
	if (marks.link) {
		run.link = marks.link;
		run.color = LINK_COLOR;
		run.decoration = 'underline';
	}
	return run;
}

function marksForElement(
	tag: string,
	el: Element,
	current: ActiveMarks
): ActiveMarks {
	const next: ActiveMarks = { ...current };
	if (tag === 'strong' || tag === 'b') {
		next.bold = true;
	} else if (tag === 'em' || tag === 'i') {
		next.italics = true;
	} else if (tag === 'u') {
		next.underline = true;
	} else if (tag === 's' || tag === 'strike' || tag === 'del') {
		next.strike = true;
	} else if (tag === 'a') {
		const href = el.getAttribute('href')?.trim();
		if (href) {
			next.link = href;
		}
	}
	return next;
}

// Walk inline content (text nodes + inline formatting elements), producing styled
// runs. Hard breaks become newline runs so pdfmake keeps them within a paragraph.
function collectInlineRuns(
	node: Node,
	marks: ActiveMarks,
	out: PdfTextRun[]
): void {
	if (node.nodeType === Node.TEXT_NODE) {
		const text = node.textContent ?? '';
		if (text.length > 0) {
			out.push(makeRun(text, marks));
		}
		return;
	}
	if (node.nodeType !== Node.ELEMENT_NODE) {
		return;
	}
	const el = node as Element;
	const tag = el.tagName.toLowerCase();
	if (tag === 'br') {
		out.push(makeRun('\n', marks));
		return;
	}
	const nextMarks = marksForElement(tag, el, marks);
	for (const child of Array.from(el.childNodes)) {
		collectInlineRuns(child, nextMarks, out);
	}
}

function inlineRunsOf(el: Element): PdfTextRun[] {
	const runs: PdfTextRun[] = [];
	for (const child of Array.from(el.childNodes)) {
		collectInlineRuns(child, {}, runs);
	}
	return runs;
}

function paragraphOf(
	el: Element,
	margin: Margin,
	fontSize?: number
): PdfParagraph {
	const runs = inlineRunsOf(el);
	const para: PdfParagraph = {
		// An empty paragraph still needs a run so it renders as a blank line.
		text: runs.length > 0 ? runs : [{ text: ' ' }],
		margin,
	};
	if (fontSize !== undefined) {
		para.fontSize = fontSize;
	}
	return para;
}

// A list item may contain inline text plus nested lists/paragraphs. When it holds
// only inline text we emit a single paragraph; otherwise a stack of blocks.
function listItemOf(li: Element): PdfListItem {
	const blocks: PdfBlock[] = [];
	const inlineRuns: PdfTextRun[] = [];

	for (const child of Array.from(li.childNodes)) {
		if (child.nodeType === Node.ELEMENT_NODE) {
			const childTag = (child as Element).tagName.toLowerCase();
			if (
				childTag === 'ul' ||
				childTag === 'ol' ||
				childTag === 'p' ||
				childTag === 'blockquote'
			) {
				if (inlineRuns.length > 0) {
					blocks.push({ text: [...inlineRuns], margin: [0, 0, 0, 0] });
					inlineRuns.length = 0;
				}
				blocks.push(...blocksOf(child as Element));
				continue;
			}
		}
		collectInlineRuns(child, {}, inlineRuns);
	}

	if (blocks.length === 0) {
		return { text: inlineRuns.length > 0 ? inlineRuns : [{ text: ' ' }] };
	}
	if (inlineRuns.length > 0) {
		blocks.unshift({ text: inlineRuns, margin: [0, 0, 0, 0] });
	}
	return { stack: blocks };
}

function listOf(el: Element, ordered: boolean): PdfList {
	const items: PdfListItem[] = [];
	for (const child of Array.from(el.children)) {
		if (child.tagName.toLowerCase() === 'li') {
			items.push(listItemOf(child));
		}
	}
	return ordered
		? { ol: items, margin: PARAGRAPH_MARGIN }
		: { ul: items, margin: PARAGRAPH_MARGIN };
}

// Convert a single block-level element into one or more pdfmake blocks.
function blocksOf(el: Element): PdfBlock[] {
	const tag = el.tagName.toLowerCase();
	if (tag === 'ul') {
		return [listOf(el, false)];
	}
	if (tag === 'ol') {
		return [listOf(el, true)];
	}
	if (tag === 'blockquote') {
		const inner: PdfBlock[] = [];
		for (const child of Array.from(el.children)) {
			inner.push(...blocksOf(child));
		}
		if (inner.length === 0) {
			inner.push({ text: inlineRunsOf(el), margin: [0, 0, 0, 0] });
		}
		return [{ stack: inner, margin: BLOCKQUOTE_MARGIN }];
	}
	const headingMatch = HEADING_TAG.exec(tag);
	if (headingMatch) {
		const level = Number(headingMatch[1]);
		const runs = inlineRunsOf(el).map((run) => ({ ...run, bold: true }));
		return [
			{
				text: runs.length > 0 ? runs : [{ text: ' ' }],
				fontSize: HEADING_FONT_SIZES[level],
				margin: [0, 0, 0, 6] as Margin,
			},
		];
	}
	// Default: treat as a paragraph (covers <p> and any unknown block wrapper).
	return [paragraphOf(el, PARAGRAPH_MARGIN)];
}

/**
 * Parse the editor's HTML into pdfmake content blocks. Returns a single blank
 * paragraph when the content is empty so the letter body never collapses.
 */
export function htmlToPdfmakeContent(html: string): PdfBlock[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html || '<p></p>', 'text/html');
	const blocks: PdfBlock[] = [];
	for (const child of Array.from(doc.body.children)) {
		blocks.push(...blocksOf(child));
	}
	if (blocks.length === 0) {
		blocks.push({ text: [{ text: ' ' }], margin: PARAGRAPH_MARGIN });
	}
	return blocks;
}
