'use node';

// Converts the HTML emitted by the portal's Tiptap `RichTextEditor` (and the
// mobile TenTap editor, which shares the same Tiptap tag vocabulary) into
// pdfmake content nodes. This is a node-safe port of
// `apps/portal/lib/pdf/html-to-pdfmake.ts`: the only difference is the DOM
// source — the browser file uses `DOMParser`, this one uses `node-html-parser`
// so it runs inside the sandboxed Convex `'use node'` action. Keep the two in
// sync so a letter renders identically in the portal preview and on the server.

import { type HTMLElement, type Node, parse } from 'node-html-parser';

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

// node-html-parser's NodeType enum values (mirror the browser DOM numbers).
const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

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

function isElement(node: Node): node is HTMLElement {
	return node.nodeType === ELEMENT_NODE;
}

function elementChildren(el: HTMLElement): HTMLElement[] {
	return el.childNodes.filter(isElement);
}

function tagOf(el: HTMLElement): string {
	return el.tagName.toLowerCase();
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
	el: HTMLElement,
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
	if (node.nodeType === TEXT_NODE) {
		const text = node.text ?? '';
		if (text.length > 0) {
			out.push(makeRun(text, marks));
		}
		return;
	}
	if (!isElement(node)) {
		return;
	}
	const el = node;
	const tag = tagOf(el);
	if (tag === 'br') {
		out.push(makeRun('\n', marks));
		return;
	}
	const nextMarks = marksForElement(tag, el, marks);
	for (const child of el.childNodes) {
		collectInlineRuns(child, nextMarks, out);
	}
}

function inlineRunsOf(el: HTMLElement): PdfTextRun[] {
	const runs: PdfTextRun[] = [];
	for (const child of el.childNodes) {
		collectInlineRuns(child, {}, runs);
	}
	return runs;
}

function paragraphOf(
	el: HTMLElement,
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
function listItemOf(li: HTMLElement): PdfListItem {
	const blocks: PdfBlock[] = [];
	const inlineRuns: PdfTextRun[] = [];

	for (const child of li.childNodes) {
		if (isElement(child)) {
			const childTag = tagOf(child);
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
				blocks.push(...blocksOf(child));
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

function listOf(el: HTMLElement, ordered: boolean): PdfList {
	const items: PdfListItem[] = [];
	for (const child of elementChildren(el)) {
		if (tagOf(child) === 'li') {
			items.push(listItemOf(child));
		}
	}
	return ordered
		? { ol: items, margin: PARAGRAPH_MARGIN }
		: { ul: items, margin: PARAGRAPH_MARGIN };
}

// Convert a single block-level element into one or more pdfmake blocks.
function blocksOf(el: HTMLElement): PdfBlock[] {
	const tag = tagOf(el);
	if (tag === 'ul') {
		return [listOf(el, false)];
	}
	if (tag === 'ol') {
		return [listOf(el, true)];
	}
	if (tag === 'blockquote') {
		const inner: PdfBlock[] = [];
		for (const child of elementChildren(el)) {
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
	const root = parse(html || '<p></p>');
	const blocks: PdfBlock[] = [];
	for (const child of elementChildren(root as unknown as HTMLElement)) {
		blocks.push(...blocksOf(child));
	}
	if (blocks.length === 0) {
		blocks.push({ text: [{ text: ' ' }], margin: PARAGRAPH_MARGIN });
	}
	return blocks;
}
