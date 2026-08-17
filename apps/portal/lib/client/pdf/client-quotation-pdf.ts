import { env } from '@workspace/env/portal';
import { formatAud, formatAudWhole } from '@/lib/currency';
import { htmlToPdfmakeContent, type PdfBlock } from '@/lib/pdf/html-to-pdfmake';
import { getClientQuotationPdfLogoDataUrl } from '@/lib/pdf/pdf-assets';
import { getPdfMakeWithInter } from '@/lib/pdf/pdf-fonts';
import {
	A4_HEIGHT,
	A4_WIDTH,
	QUOTATION_COLORS as C,
	COVER_DESCRIPTION_MAX_LENGTH,
	COVER_TITLE_COMPACT_THRESHOLD,
	QUOTATION_FONT_SIZES as F,
	GST_RATE_LABEL,
	QUOTATION_LAYOUT as L,
	QUOTATION_LINE_HEIGHTS as LH,
	QUOTATION_SPACING as S,
	QUOTATION_TRACKING as T,
} from './client-quotation-theme';

export interface QuotationPdfClient {
	email: string;
	name: string;
	phone: string;
}

export interface QuotationPdfItem {
	description?: string;
	name: string;
}

export interface QuotationPdfSection {
	items: QuotationPdfItem[];
	name: string;
}

export interface QuotationPdfStage {
	amount: number;
	name: string;
	percent: number;
	scopeSummary?: string;
	sections: QuotationPdfSection[];
}

export interface QuotationPdfTermSection {
	items: string[];
	name: string;
}

export interface QuotationPdfInput {
	acknowledgementHtml: string;
	address: {
		postcode: string;
		state: string;
		street: string;
		suburb: string;
	};
	clients: QuotationPdfClient[];
	contractSumExclGst: number;
	description?: string;
	disclaimerHtml: string;
	gstAmount: number;
	// Human-readable issue date, e.g. "12 August 2026".
	issuedAtLabel: string;
	projectName: string;
	reference: string;
	stages: QuotationPdfStage[];
	termSections: QuotationPdfTermSection[];
	totalInclGst: number;
	validityDays: number;
}

// pdfmake's document model has no published types; every builder in this repo
// hands it plain objects.
type Node = Record<string, unknown>;

const CONTENT_WIDTH = A4_WIDTH - L.sidePadding * 2;
const URL_SCHEME = /^https?:\/\//;
const NON_SLUG_CHARS = /[^a-z0-9]+/g;

// Node ids must be unique across the document, so the section leads are
// namespaced by prefix and matched that way in `pageBreakBefore`.
const SECTION_OPENING_ID_PREFIX = 'section-opening-';

// Intrinsic aspect of public/logo.svg (viewBox 7627 × 3029), which the linen
// PNG is derived from.
const LOGO_ASPECT = 7627 / 3029;
// 78pt wide is ~31pt tall, which clears the 68pt header band comfortably and
// balances against the address lines opposite. Much larger and the script
// descender runs into the band edge.
const HEADER_LOGO_WIDTH = 78;
const COVER_LOGO_WIDTH = 190;
const HEADER_TEXT_LINE_HEIGHT = 1.4;

// Cover geometry. The three blocks are absolutely positioned so they hold the
// template's rhythm regardless of how long the project name runs; the details
// bank is measured and pinned to the foot of the page (see `coverDetailsTop`).
const COVER_TEXT_WIDTH = 383;
const COVER_TITLE_Y = 250;
const LABEL_MARGIN_BOTTOM = 5;
/**
 * A rendered line box is the font's ascender-to-descender span, not the point
 * size — for Inter that is ~1.25em. Any height we predict for absolutely
 * positioned text has to account for it or the block silently overruns.
 */
const FONT_LINE_BOX = 1.25;
/** Slack on predicted heights, so a rounding error never costs a page break. */
const COVER_DETAILS_SAFETY_PAD = 8;

function textBlockHeight(
	fontSize: number,
	lineHeight: number,
	lines: number
): number {
	return lines * fontSize * lineHeight * FONT_LINE_BOX;
}

function panelHeight(
	lines: { count: number; size: number }[],
	padY: number
): number {
	const content = lines.reduce(
		(sum, line) => sum + line.count * line.size * LH.tight,
		0
	);
	return padY * 2 + content;
}

/**
 * A rounded, filled or outlined block. pdfmake has no box model, so the surface
 * is a `canvas` rect and the content is pulled back over it with a negative top
 * margin. The height must therefore be known up front — only use this where the
 * line count is fixed (pills, badges, the summary card, signature boxes). For a
 * block whose height depends on user content, use `tintedCard` instead.
 */
function roundedPanel(options: {
	content: Node[];
	fill?: string;
	height: number;
	padX?: number;
	padY?: number;
	radius?: number;
	stroke?: string;
	width: number;
}): Node {
	const {
		content,
		fill,
		height,
		padX = 14,
		padY = 10,
		radius = L.radius,
		stroke,
		width,
	} = options;
	return {
		width,
		stack: [
			{
				canvas: [
					{
						type: 'rect',
						x: 0,
						y: 0,
						w: width,
						h: height,
						r: radius,
						...(fill ? { color: fill } : {}),
						...(stroke ? { lineColor: stroke, lineWidth: 1 } : {}),
					},
				],
			},
			{
				stack: content,
				margin: [padX, -(height - padY), padX, 0],
			},
		],
		// The stack under-consumes by the bottom padding (the content is shorter
		// than the rect it sits on), so give it back here.
		margin: [0, 0, 0, padY],
	};
}

/**
 * A tinted, square-cornered card that grows with its content. Used for the
 * disclaimer and acknowledgement, whose height comes from editable rich text.
 */
function tintedCard(content: Node[] | PdfBlock[]): Node {
	return {
		table: { widths: ['*'], body: [[{ stack: content, border: [] }]] },
		layout: {
			defaultBorder: false,
			fillColor: () => C.surface,
			paddingBottom: () => S.cardPadY,
			paddingLeft: () => S.cardPadX,
			paddingRight: () => S.cardPadX,
			paddingTop: () => S.cardPadY,
		},
		margin: [0, 0, 0, S.block],
	};
}

/**
 * The portal wordmark, in brand linen so it reads on the ink cover and header
 * band. This is the full lockup — mark plus "Luxuria Homes" — so nothing should
 * set the company name as text beside it.
 */
function brandLogo(logoDataUrl: string, width: number): Node {
	return {
		width,
		image: logoDataUrl,
		fit: [width, width / LOGO_ASPECT],
	};
}

function kickerNode(text: string): Node {
	return {
		text: text.toUpperCase(),
		fontSize: F.kicker,
		characterSpacing: T.kicker,
		color: C.accent,
		bold: true,
		margin: [0, 0, 0, S.kickerToHeading],
	};
}

function labelNode(text: string, color: string): Node {
	return {
		text: text.toUpperCase(),
		fontSize: F.label,
		characterSpacing: T.label,
		color,
		bold: true,
		margin: [0, 0, 0, LABEL_MARGIN_BOTTOM],
	};
}

function sectionOpening(
	kicker: string,
	heading: string,
	lead?: string
): Node[] {
	const nodes: Node[] = [
		kickerNode(kicker),
		{
			text: heading,
			fontSize: F.sectionHeading,
			bold: true,
			color: C.body,
			lineHeight: LH.heading,
			margin: [0, 0, 0, S.headingToLead],
		},
	];
	if (lead) {
		nodes.push({
			text: lead,
			fontSize: F.body,
			color: C.accent,
			lineHeight: LH.body,
			margin: [0, 0, 0, S.leadToContent],
			// A section heading stranded at the foot of a page reads as a mistake.
			// pdfmake requires node ids to be unique, so qualify it by section.
			id: `${SECTION_OPENING_ID_PREFIX}${kicker.toLowerCase().replace(NON_SLUG_CHARS, '-')}`,
		});
	}
	return nodes;
}

function addressLines(address: QuotationPdfInput['address']): string[] {
	return [
		address.street,
		`${address.suburb} ${address.state.toUpperCase()} ${address.postcode}`,
	];
}

// ---------------------------------------------------------------------------
// Page chrome
// ---------------------------------------------------------------------------

function companyHeaderLines(): string[] {
	const lines = [env.NEXT_PUBLIC_CONTACT_ADDRESS];
	const credentials = [
		env.NEXT_PUBLIC_QBCC_LICENCE ? `QBCC ${env.NEXT_PUBLIC_QBCC_LICENCE}` : '',
		env.NEXT_PUBLIC_ABN ? `ABN ${env.NEXT_PUBLIC_ABN}` : '',
	].filter(Boolean);
	if (credentials.length > 0) {
		lines.push(credentials.join('  ·  '));
	}
	return lines;
}

/**
 * Rendered line count, not entry count — a configured address may carry its own
 * newlines, and those lines have to be counted for the block to sit centred.
 */
function headerTextLineCount(lines: string[]): number {
	return lines.reduce((total, line) => total + line.split('\n').length, 0);
}

/** Top margin that centres a block of known height inside the header band. */
function bandCenterOffset(contentHeight: number): number {
	return Math.max((L.headerBandHeight - contentHeight) / 2, 0);
}

function pageHeader(logoDataUrl: string, currentPage: number): Node | null {
	if (currentPage === 1) {
		return null;
	}
	const textLines = companyHeaderLines();
	const logoHeight = HEADER_LOGO_WIDTH / LOGO_ASPECT;
	const textHeight =
		headerTextLineCount(textLines) * F.band * HEADER_TEXT_LINE_HEIGHT;

	// Each side is centred on its own height rather than sharing one top margin
	// on the columns block — the logo and the address are different heights, so a
	// shared margin can only ever centre one of them.
	return {
		columns: [
			{
				width: '*',
				stack: [brandLogo(logoDataUrl, HEADER_LOGO_WIDTH)],
				margin: [0, bandCenterOffset(logoHeight), 0, 0],
			},
			{
				width: 'auto',
				stack: textLines.map((line) => ({ text: line })),
				alignment: 'right',
				fontSize: F.band,
				color: C.linenMuted,
				lineHeight: HEADER_TEXT_LINE_HEIGHT,
				margin: [0, bandCenterOffset(textHeight), 0, 0],
			},
		],
		margin: [L.sidePadding, 0, L.sidePadding, 0],
	};
}

function pageFooter(currentPage: number): Node | null {
	if (currentPage === 1) {
		return null;
	}
	const contact = [
		env.NEXT_PUBLIC_CONTACT_PHONE,
		env.NEXT_PUBLIC_CONTACT_EMAIL,
		env.NEXT_PUBLIC_WEB_URL.replace(URL_SCHEME, ''),
	].join('  ·  ');
	return {
		columns: [
			{ width: '*', text: contact, fontSize: F.band, color: C.linenMuted },
			{
				width: 'auto',
				text: `Page ${currentPage}`,
				fontSize: F.band,
				color: C.linen,
				alignment: 'right',
			},
		],
		// The footer region starts `bandClearance` above the band, so clear that
		// first, then centre the single line of text within the band itself.
		margin: [
			L.sidePadding,
			L.bandClearance +
				(L.footerBandHeight - F.band * HEADER_TEXT_LINE_HEIGHT) / 2,
			L.sidePadding,
			0,
		],
	};
}

function pageBackground(currentPage: number): Node {
	if (currentPage === 1) {
		return {
			canvas: [
				{ type: 'rect', x: 0, y: 0, w: A4_WIDTH, h: A4_HEIGHT, color: C.ink },
			],
		};
	}
	return {
		canvas: [
			{
				type: 'rect',
				x: 0,
				y: 0,
				w: A4_WIDTH,
				h: L.headerBandHeight,
				color: C.ink,
			},
			{
				type: 'rect',
				x: 0,
				y: A4_HEIGHT - L.footerBandHeight,
				w: A4_WIDTH,
				h: L.footerBandHeight,
				color: C.ink,
			},
		],
	};
}

// ---------------------------------------------------------------------------
// Page 1 — cover
// ---------------------------------------------------------------------------

/** A labelled block of lines, used for the cover details and the sign-off page. */
function detailsColumn(
	label: string,
	lines: string[],
	options: { labelColor?: string; valueColor?: string } = {}
): Node {
	return {
		width: '*',
		stack: [
			labelNode(label, options.labelColor ?? C.accent),
			...lines.map((line) => ({
				text: line,
				fontSize: F.body,
				color: options.valueColor ?? C.body,
				lineHeight: LH.body,
			})),
		],
	};
}

/** Height of a `detailsColumn` with the given number of value lines. */
function detailsColumnHeight(lineCount: number): number {
	return (
		textBlockHeight(F.label, LH.tight, 1) +
		LABEL_MARGIN_BOTTOM +
		textBlockHeight(F.body, LH.body, lineCount)
	);
}

/**
 * Prepared-for / address / reference / total, banked along the bottom of the ink
 * cover. These sit on the dark background, so they take the inverted palette.
 */
function coverDetails(input: QuotationPdfInput): Node {
	const onInk = { labelColor: C.linenMuted, valueColor: C.linen };
	const clientLines = input.clients.flatMap((client, index) => {
		const lines = [client.name, client.phone, client.email].filter(Boolean);
		return index === 0 ? lines : ['', ...lines];
	});

	return {
		stack: [
			{
				columns: [
					detailsColumn('Prepared for', clientLines, onInk),
					detailsColumn('Project address', addressLines(input.address), onInk),
				],
				columnGap: 28,
				margin: [0, 0, 0, S.block * 2],
			},
			{
				columns: [
					detailsColumn(
						'Quote reference',
						[
							input.reference,
							`Issued ${input.issuedAtLabel}`,
							`Valid for ${input.validityDays} days`,
						],
						onInk
					),
					{
						width: '*',
						stack: [
							labelNode('Total investment', C.linenMuted),
							{
								text: formatAudWhole(input.totalInclGst),
								fontSize: F.total,
								bold: true,
								color: C.linen,
							},
							{
								text: 'Including GST',
								fontSize: F.bodySmall,
								color: C.linenMuted,
								margin: [0, 4, 0, 0],
							},
						],
					},
				],
				columnGap: 28,
			},
		],
	};
}

/**
 * The details bank is absolutely positioned, and absolutely positioned content
 * that runs past the page still paginates — silently pushing its last lines onto
 * page 2. So anchor it off the page bottom using its own measured height rather
 * than a fixed y that only happens to fit one client.
 */
function coverDetailsTop(input: QuotationPdfInput): number {
	const clientLineCount = input.clients.length * 3 + (input.clients.length - 1);
	const firstRow = Math.max(
		detailsColumnHeight(clientLineCount),
		detailsColumnHeight(addressLines(input.address).length)
	);
	const totalColumnHeight =
		textBlockHeight(F.label, LH.tight, 1) +
		LABEL_MARGIN_BOTTOM +
		textBlockHeight(F.total, LH.body, 1) +
		4 +
		textBlockHeight(F.bodySmall, LH.body, 1);
	const secondRow = Math.max(detailsColumnHeight(3), totalColumnHeight);
	const height = firstRow + S.block * 2 + secondRow;
	const usableBottom = A4_HEIGHT - (L.footerBandHeight + L.bandClearance);
	return usableBottom - height - COVER_DETAILS_SAFETY_PAD;
}

function coverPage(input: QuotationPdfInput, logoDataUrl: string): Node[] {
	const titleSize =
		input.projectName.length > COVER_TITLE_COMPACT_THRESHOLD
			? F.coverTitleCompact
			: F.coverTitle;
	const description = input.description?.slice(0, COVER_DESCRIPTION_MAX_LENGTH);

	return [
		// Decorative arc, echoing the template. Drawn first so it sits behind the
		// copy, and clipped by the page edge on the right.
		{
			absolutePosition: { x: 360, y: 210 },
			canvas: [
				{
					type: 'ellipse',
					x: 0,
					y: 0,
					r1: 205,
					r2: 205,
					lineColor: C.accent,
					lineWidth: 1,
				},
			],
		},
		{
			absolutePosition: { x: L.sidePadding, y: 96 },
			stack: [
				brandLogo(logoDataUrl, COVER_LOGO_WIDTH),
				{
					text: 'LUXURY HOME BUILDERS · BRISBANE',
					fontSize: F.coverBrandKicker,
					characterSpacing: T.brandKicker,
					color: C.linenMuted,
					margin: [0, 10, 0, 0],
				},
			],
		},
		{
			absolutePosition: { x: L.sidePadding, y: COVER_TITLE_Y },
			width: COVER_TEXT_WIDTH,
			stack: [
				roundedPanel({
					content: [
						{
							text: 'BUILDING QUOTATION',
							fontSize: F.coverBrandKicker,
							characterSpacing: T.brandKicker,
							color: C.linen,
							lineHeight: LH.tight,
						},
					],
					height: panelHeight([{ count: 1, size: F.coverBrandKicker }], 7),
					padX: 16,
					padY: 7,
					radius: L.pillRadius,
					stroke: C.accent,
					width: 150,
				}),
				{
					text: input.projectName,
					fontSize: titleSize,
					bold: true,
					color: C.linen,
					lineHeight: 1.06,
					margin: [0, 14, 0, 0],
					width: COVER_TEXT_WIDTH,
				},
				...(description
					? [
							{
								text: description,
								fontSize: F.coverBody,
								color: C.linenMuted,
								lineHeight: 1.55,
								margin: [0, 14, 0, 0],
								width: COVER_TEXT_WIDTH,
							},
						]
					: []),
			],
		},
		{
			absolutePosition: { x: L.sidePadding, y: coverDetailsTop(input) },
			width: CONTENT_WIDTH,
			stack: [coverDetails(input)],
		},
		{ text: '', pageBreak: 'after' },
	];
}

// ---------------------------------------------------------------------------
// The contract-sum breakdown card
// ---------------------------------------------------------------------------

function summaryCard(input: QuotationPdfInput): Node {
	const width = L.summaryCardWidth;
	const padX = S.cardPadX;
	const padY = S.cardPadY;
	const rowGap = 6;
	const ruleGapAbove = 2;
	const ruleGapBelow = 8;

	const row = (label: string, value: string): Node => ({
		columns: [
			{ width: '*', text: label, fontSize: F.bodySmall, color: C.accent },
			{
				width: 'auto',
				text: value,
				fontSize: F.bodySmall,
				color: C.body,
				alignment: 'right',
			},
		],
		margin: [0, 0, 0, rowGap],
		lineHeight: LH.tight,
	});

	// Measured rather than guessed: the earlier version summed only the text
	// heights and left the total line hanging out the bottom of the rect.
	const rowHeight = F.bodySmall * LH.tight + rowGap;
	const ruleHeight = ruleGapAbove + 0.7 + ruleGapBelow;
	const totalRowHeight = F.totalSmall * LH.tight;
	const height =
		padY * 2 + rowHeight * 2 + ruleHeight + totalRowHeight + rowGap;

	return roundedPanel({
		content: [
			row('Contract sum (excl. GST)', formatAud(input.contractSumExclGst)),
			row(GST_RATE_LABEL, formatAud(input.gstAmount)),
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 0,
						x2: width - padX * 2,
						y2: 0,
						lineWidth: 0.7,
						lineColor: C.divider,
					},
				],
				margin: [0, ruleGapAbove, 0, ruleGapBelow],
			},
			{
				columns: [
					{
						width: '*',
						text: 'TOTAL INCL. GST',
						fontSize: F.label,
						characterSpacing: T.label,
						bold: true,
						color: C.accent,
						margin: [0, (F.totalSmall - F.label) * LH.tight * 0.6, 0, 0],
					},
					{
						width: 'auto',
						text: formatAudWhole(input.totalInclGst),
						fontSize: F.totalSmall,
						bold: true,
						color: C.body,
						alignment: 'right',
					},
				],
				lineHeight: LH.tight,
			},
		],
		fill: C.surface,
		height,
		padX,
		padY,
		width,
	});
}

// ---------------------------------------------------------------------------
// Section 01 — progress payments
// ---------------------------------------------------------------------------

function stageScopeText(stage: QuotationPdfStage): string {
	const summary = stage.scopeSummary?.trim();
	if (summary) {
		return summary;
	}
	return stage.sections.map((section) => section.name).join(' · ');
}

function sectionOnePage(input: QuotationPdfInput): Node[] {
	const headerCell = (text: string, alignment?: string): Node => ({
		text: text.toUpperCase(),
		fontSize: F.tableHeader,
		characterSpacing: T.label,
		bold: true,
		color: C.linen,
		fillColor: C.ink,
		alignment,
	});

	const body: Node[][] = [
		[
			headerCell('Stage'),
			headerCell('Scope of works'),
			headerCell('%', 'right'),
			headerCell('Amount', 'right'),
		],
		...input.stages.map((stage, index) => {
			const fillColor = index % 2 === 1 ? C.surfaceSubtle : undefined;
			return [
				{
					columns: [
						{
							width: 16,
							text: String(index + 1),
							fontSize: F.tableHeader,
							bold: true,
							color: C.accent,
							margin: [0, 2, 0, 0],
						},
						{
							width: '*',
							text: stage.name,
							fontSize: F.tableCell,
							bold: true,
							color: C.body,
						},
					],
					fillColor,
				},
				{
					text: stageScopeText(stage),
					fontSize: F.tableScope,
					color: C.accent,
					lineHeight: LH.body,
					fillColor,
				},
				{
					text: `${stage.percent}%`,
					fontSize: F.tableCell,
					color: C.body,
					alignment: 'right',
					fillColor,
				},
				{
					text: formatAudWhole(stage.amount),
					fontSize: F.tableCell,
					bold: true,
					color: C.body,
					alignment: 'right',
					fillColor,
				},
			];
		}),
	];

	return [
		...sectionOpening(
			'Section 01',
			'Construction stages & progress payments',
			'Payments are claimed at the completion of each stage below and are due within five business days of the claim being issued. All amounts are inclusive of GST.'
		),
		{
			// The schedule and the sum it adds up to belong together — splitting
			// them leaves a total stranded at the top of the next page.
			unbreakable: true,
			stack: [
				{
					table: {
						headerRows: 1,
						dontBreakRows: true,
						// The % column needs room for "100%" on one line — 8% wraps it.
						widths: ['24%', '43%', '11%', '22%'],
						body,
					},
					layout: {
						defaultBorder: false,
						hLineWidth: (i: number) => (i === 0 || i === 1 ? 0 : 0.5),
						vLineWidth: () => 0,
						hLineColor: () => C.divider,
						paddingBottom: () => S.tableCell,
						paddingLeft: (i: number) => (i === 0 ? 10 : 7),
						paddingRight: (i: number) => (i === 3 ? 10 : 7),
						paddingTop: () => S.tableCell,
					},
				},
				{
					columns: [{ width: '*', text: '' }, summaryCard(input)],
					margin: [0, S.block * 2, 0, 0],
				},
			],
		},
	];
}

// ---------------------------------------------------------------------------
// Section 02 — inclusions
// ---------------------------------------------------------------------------

function stagePill(stage: QuotationPdfStage): Node {
	return roundedPanel({
		content: [
			{
				columns: [
					{
						width: '*',
						text: stage.name,
						fontSize: F.stageTitle,
						bold: true,
						color: C.linen,
						lineHeight: LH.tight,
					},
					{
						width: 'auto',
						alignment: 'right',
						// Amount and share on one line — "$47,500 (5%)" — so the pill
						// stays a single row of text.
						text: [
							{
								text: formatAudWhole(stage.amount),
								bold: true,
								color: C.linen,
							},
							{ text: `  (${stage.percent}%)`, color: C.linenMuted },
						],
						fontSize: F.stageAmount,
						lineHeight: LH.tight,
					},
				],
			},
		],
		fill: C.ink,
		height: L.stagePillHeight,
		padX: 14,
		padY: (L.stagePillHeight - F.stageTitle * LH.tight) / 2,
		width: CONTENT_WIDTH,
	});
}

function inclusionBullet(item: QuotationPdfItem): Node {
	return {
		columns: [
			// An em-dash is nearly a full em wide, so the column has to exceed the
			// font size or the dash butts straight into the text.
			{ width: 17, text: '—', color: C.linenMuted },
			{
				width: '*',
				text: item.description?.trim() || item.name,
				fontSize: F.body,
				color: C.body,
				lineHeight: 1.5,
			},
		],
		margin: [0, 0, 0, 7],
	};
}

function inclusionSubsection(
	section: QuotationPdfSection,
	label: string
): Node {
	return {
		// A subsection is a handful of bullets and always fits a page, so keeping
		// it whole never forces an awkward break the way a whole stage would.
		unbreakable: true,
		stack: [
			{
				text: `${label} · ${section.name.toUpperCase()}`,
				fontSize: F.subheading,
				characterSpacing: T.label,
				bold: true,
				color: C.accent,
				margin: [0, 0, 0, 4],
			},
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 0,
						x2: CONTENT_WIDTH,
						y2: 0,
						lineWidth: 0.5,
						lineColor: C.divider,
					},
				],
				margin: [0, 0, 0, 7],
			},
			...section.items.map(inclusionBullet),
		],
		margin: [0, 0, 0, S.subsection],
	};
}

function sectionTwoPage(input: QuotationPdfInput): Node[] {
	// A stage with everything deselected still owes a progress payment, so it
	// keeps its Section 01 row — it just has nothing to list here.
	const stages = input.stages
		.map((stage, index) => ({ stage, number: index + 1 }))
		.filter(({ stage }) =>
			stage.sections.some((section) => section.items.length > 0)
		);
	if (stages.length === 0) {
		return [];
	}

	return [
		{ text: '', pageBreak: 'before' },
		...sectionOpening(
			'Section 02',
			'What each stage includes',
			'Everything listed below is allowed for within the contract sum. Where an allowance is stated, the figure is a supply-and-install budget confirmed at selections.'
		),
		...stages.flatMap(({ stage, number }) => {
			const subsections = stage.sections
				.filter((section) => section.items.length > 0)
				.map((section, sectionIndex) =>
					inclusionSubsection(section, `${number}.${sectionIndex + 1}`)
				);
			const [first, ...rest] = subsections;
			return [
				{
					// Bind the pill to its first subsection. A `pageBreakBefore`
					// heuristic can only guess at the remaining space, whereas an
					// unbreakable pair makes a stranded stage header impossible.
					unbreakable: true,
					stack: [
						{ ...stagePill(stage), margin: [0, 0, 0, S.pillToContent] },
						...(first ? [first] : []),
					],
					margin: [0, S.block, 0, 0],
				},
				...rest,
			];
		}),
	];
}

// ---------------------------------------------------------------------------
// Sections 03–05 — disclaimer, terms, acknowledgement
// ---------------------------------------------------------------------------

/**
 * The disclaimer and acknowledgement are authored in the Quote Terms rich-text
 * editor, whose converter emits neutral defaults. Push the quotation's type
 * scale onto anything that didn't set its own.
 */
function restyle(blocks: PdfBlock[]): Node[] {
	return blocks.map((block) => {
		const node = { ...block } as Node;
		if (node.fontSize === undefined) {
			node.fontSize = F.bodySmall;
		}
		node.color ??= C.accent;
		node.lineHeight ??= LH.body;
		if (Array.isArray(node.stack)) {
			node.stack = restyle(node.stack as PdfBlock[]);
		}
		if (Array.isArray(node.ul)) {
			node.ul = restyle(node.ul as PdfBlock[]);
		}
		if (Array.isArray(node.ol)) {
			node.ol = restyle(node.ol as PdfBlock[]);
		}
		return node;
	});
}

function sectionThreePage(input: QuotationPdfInput): Node[] {
	const content = restyle(htmlToPdfmakeContent(input.disclaimerHtml));
	if (content.length === 0) {
		return [];
	}
	return [
		{ text: '', pageBreak: 'before' },
		...sectionOpening('Section 03', 'Disclaimer'),
		tintedCard(content),
	];
}

function sectionFourPage(input: QuotationPdfInput): Node[] {
	if (input.termSections.length === 0) {
		return [];
	}
	return [
		{ text: '', pageBreak: 'before' },
		...sectionOpening('Section 04', 'Terms & conditions'),
		...input.termSections.map((section, index) => ({
			unbreakable: true,
			stack: [
				{
					text: `${index + 1} · ${section.name}`,
					fontSize: F.subheading,
					characterSpacing: T.label,
					bold: true,
					color: C.accent,
					margin: [0, 0, 0, 6],
				},
				...section.items.map((clause) => ({
					columns: [
						{ width: 12, text: '·', color: C.linenMuted },
						{
							width: '*',
							text: clause,
							fontSize: F.bodySmall,
							color: C.body,
							lineHeight: LH.body,
						},
					],
					margin: [0, 0, 0, S.bullet],
				})),
			],
			margin: [0, 0, 0, S.subsection],
		})),
	];
}

const SIGNATURE_COLUMN_GAP = 20;
const SIGNATURE_BOX_WIDTH = (CONTENT_WIDTH - SIGNATURE_COLUMN_GAP) / 2;

function signatureBox(title: string, subtitle?: string): Node {
	const padX = S.cardPadX;
	const padY = S.cardPadY;
	const labelHeight = F.label * LH.tight;
	const subtitleHeight = subtitle ? F.bodySmall * LH.tight + 2 : 0;
	const footerHeight = F.band * LH.tight;

	return roundedPanel({
		content: [
			{
				text: title.toUpperCase(),
				fontSize: F.label,
				characterSpacing: T.label,
				bold: true,
				color: C.accent,
				lineHeight: LH.tight,
			},
			...(subtitle
				? [
						{
							text: subtitle,
							fontSize: F.bodySmall,
							color: C.body,
							lineHeight: LH.tight,
							margin: [0, 2, 0, 0],
						},
					]
				: []),
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 0,
						x2: SIGNATURE_BOX_WIDTH - padX * 2,
						y2: 0,
						lineWidth: 0.5,
						lineColor: C.divider,
					},
				],
				margin: [0, L.signatureGap, 0, 6],
			},
			{
				columns: [
					{ width: '*', text: 'Signed', fontSize: F.band, color: C.accent },
					{
						width: 'auto',
						text: 'Date',
						fontSize: F.band,
						color: C.accent,
						alignment: 'right',
					},
				],
				lineHeight: LH.tight,
			},
		],
		height:
			padY * 2 +
			labelHeight +
			subtitleHeight +
			L.signatureGap +
			6 +
			footerHeight,
		padX,
		padY,
		stroke: C.divider,
		width: SIGNATURE_BOX_WIDTH,
	});
}

/** Lays boxes out two-up, padding the last row so the grid stays aligned. */
function signatureGrid(boxes: Node[]): Node[] {
	const rows: Node[] = [];
	for (let i = 0; i < boxes.length; i += 2) {
		const pair = boxes.slice(i, i + 2);
		rows.push({
			columns: [
				pair[0],
				{ width: SIGNATURE_COLUMN_GAP, text: '' },
				pair[1] ?? { width: SIGNATURE_BOX_WIDTH, text: '' },
			],
			unbreakable: true,
		});
	}
	return rows;
}

function sectionFivePage(input: QuotationPdfInput): Node[] {
	const acknowledgement = restyle(
		htmlToPdfmakeContent(input.acknowledgementHtml)
	);
	// One box per client, so every party to the contract has somewhere to sign,
	// then Luxuria Homes underneath.
	const clientBoxes = input.clients.map((client, index) =>
		signatureBox(
			input.clients.length > 1 ? `Client ${index + 1}` : 'Client',
			client.name
		)
	);

	return [
		{ text: '', pageBreak: 'before' },
		...sectionOpening('Section 05', 'Acknowledgement'),
		...(acknowledgement.length > 0 ? [tintedCard(acknowledgement)] : []),
		{
			columns: [
				detailsColumn('Quote reference', [input.reference]),
				detailsColumn('Project', [input.projectName]),
			],
			columnGap: 24,
			margin: [0, S.block, 0, S.block * 1.5],
			unbreakable: true,
		},
		...signatureGrid(clientBoxes),
		...signatureGrid([signatureBox('Luxuria Homes')]),
	];
}

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

// A section heading left at the foot of a page with nothing under it reads as a
// printing error. Stage pills are handled structurally instead — each is bound
// to its first subsection in an unbreakable stack.
const MIN_NODES_AFTER_SECTION_OPENING = 2;

function buildDocDefinition(
	input: QuotationPdfInput,
	font: string,
	logoDataUrl: string
): Node {
	return {
		pageSize: 'A4',
		pageMargins: [
			L.sidePadding,
			L.headerBandHeight + L.bandClearance,
			L.sidePadding,
			L.footerBandHeight + L.bandClearance,
		],
		defaultStyle: {
			font,
			fontSize: F.body,
			color: C.body,
			lineHeight: LH.body,
		},
		background: pageBackground,
		header: (currentPage: number) => pageHeader(logoDataUrl, currentPage),
		footer: pageFooter,
		pageBreakBefore: (
			currentNode: { id?: string },
			followingNodesOnPage: unknown[]
		) =>
			Boolean(currentNode.id?.startsWith(SECTION_OPENING_ID_PREFIX)) &&
			followingNodesOnPage.length < MIN_NODES_AFTER_SECTION_OPENING,
		content: [
			...coverPage(input, logoDataUrl),
			...sectionOnePage(input),
			...sectionTwoPage(input),
			...sectionThreePage(input),
			...sectionFourPage(input),
			...sectionFivePage(input),
		],
	};
}

export async function buildClientQuotationPdfBlob(
	input: QuotationPdfInput
): Promise<Blob> {
	const [{ font, pdfMake }, logoDataUrl] = await Promise.all([
		getPdfMakeWithInter(),
		getClientQuotationPdfLogoDataUrl(),
	]);
	const pdf = pdfMake.createPdf(buildDocDefinition(input, font, logoDataUrl));
	return await pdf.getBlob();
}
