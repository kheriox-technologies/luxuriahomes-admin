/**
 * Design tokens for the client quotation PDF.
 *
 * The layout is taken from `docs/client-quotation-template.pdf`; the colours and
 * typeface are the portal's own (linen / ink brand palette, Inter) rather than
 * the template's brown-and-Caprasimo treatment. Geometry is quoted in PDF points
 * — the template was authored in millimetres and pixels, so the conversions live
 * here and nowhere else.
 */

const MM_TO_PT = 2.8346;
const PX_TO_PT = 0.75;

export function mm(value: number): number {
	return Math.round(value * MM_TO_PT * 100) / 100;
}

export function px(value: number): number {
	return Math.round(value * PX_TO_PT * 100) / 100;
}

/** A4 in PDF points. */
export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;

export const QUOTATION_COLORS = {
	/** Full-bleed cover and the header/footer bands. */
	ink: '#2b2927',
	/** Text and marks on ink. */
	linen: '#f5ebe0',
	/** Secondary text on ink. */
	linenMuted: '#bcb4ac',
	/** Headings and muted body copy on light pages. */
	accent: '#514e4a',
	/** Body copy on light pages. */
	body: '#2b2927',
	/** Tinted card surfaces. */
	surface: '#f5ebe0',
	/** Zebra striping in the stage table — linen at ~25%. */
	surfaceSubtle: '#fbf7f3',
	divider: '#dcd6cf',
	white: '#ffffff',
} as const;

export const QUOTATION_LAYOUT = {
	sidePadding: mm(18),
	headerBandHeight: mm(24),
	footerBandHeight: mm(14),
	/** Clearance between a band and the first/last line of body copy. */
	bandClearance: 26,
	/**
	 * Corner radius on pills and cards. The portal's `--radius` is 0.375rem (6px)
	 * and `--radius-lg` resolves to the same, which is 4.5pt at print scale — so
	 * cards here are gently rounded rather than the template's heavy 28px.
	 */
	radius: px(6),
	/** Fully round — the cover's "Building quotation" chip. */
	pillRadius: 999,
	// One line on each side of the pill, so it only needs to clear the title.
	stagePillHeight: 30,
	summaryCardWidth: mm(92),
	/** Blank space left for a handwritten signature. */
	signatureGap: mm(16),
} as const;

/**
 * One vertical rhythm for the whole document. The quotation runs long — six
 * stages of inclusions plus terms — so these are deliberately tight; nudge the
 * scale here rather than hand-tuning margins at each call site.
 */
export const QUOTATION_SPACING = {
	/** Between a kicker and its heading. */
	kickerToHeading: 5,
	/** Between a section heading and its lead paragraph. */
	headingToLead: 8,
	/** Between a section's opening block and its first content. */
	leadToContent: 14,
	/** Between sibling blocks inside a section. */
	block: 10,
	/** Between a stage pill and the subsection under it. */
	pillToContent: 16,
	/** Between one bullet and the next. */
	bullet: 3,
	/** Between a subsection and the next. */
	subsection: 10,
	/** Vertical padding inside table cells. */
	tableCell: 7,
	/** Padding inside a tinted or rounded card. */
	cardPadY: 12,
	cardPadX: 14,
} as const;

export const QUOTATION_FONT_SIZES = {
	coverBrand: px(26),
	coverBrandKicker: px(10),
	coverTitle: px(52),
	/** Fallback title size for project names too long for one comfortable line. */
	coverTitleCompact: px(43),
	coverBody: px(15),
	kicker: px(9.5),
	// Trimmed from the template's 34px so a section heading plus its content has
	// a fair chance of staying on one page.
	sectionHeading: px(27),
	body: px(14),
	bodySmall: px(13),
	label: px(9.5),
	total: px(28),
	totalSmall: px(24),
	tableHeader: px(10),
	tableCell: px(14),
	tableScope: px(13),
	stageTitle: px(17),
	stageAmount: px(15),
	subheading: px(11),
	band: px(9),
} as const;

/** Line heights, tightened alongside the spacing scale. */
export const QUOTATION_LINE_HEIGHTS = {
	body: 1.4,
	tight: 1.2,
	heading: 1.12,
} as const;

/** Extra letter-spacing on the uppercase kickers and labels. */
export const QUOTATION_TRACKING = {
	kicker: 1.4,
	label: 1.2,
	brandKicker: 1.6,
} as const;

/** Beyond this, the cover title drops to the compact size to stay on the page. */
export const COVER_TITLE_COMPACT_THRESHOLD = 46;

/** Cover copy is clipped past this — absolutely-positioned text cannot reflow. */
export const COVER_DESCRIPTION_MAX_LENGTH = 400;

export const GST_RATE_LABEL = 'GST 10%';
