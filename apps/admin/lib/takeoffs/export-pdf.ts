import {
	PDFDocument,
	type PDFFont,
	type PDFPage,
	rgb,
	StandardFonts,
} from 'pdf-lib';
import { buildLegendEntries } from '@/components/takeoffs/measurements-panel';
import {
	circleRadius,
	groupColorMap,
	rectBounds,
	resolveMpp,
	shapeBadgeLines,
	shapeTopCenter,
} from '@/lib/takeoffs/geometry';
import type {
	Legend,
	Measurement,
	MeasurementMethod,
	PageGeometry,
	Point,
	TextAnnotation,
} from '@/lib/takeoffs/types';

// Per-type default colours (mirrors TOOL_COLORS in pdf-stage.tsx).
const TYPE_COLORS: Record<string, string> = {
	linear: '#2563eb',
	rectangle: '#059669',
	circle: '#059669',
	polygon: '#059669',
	count: '#7c3aed',
};
const FALLBACK_COLOR = '#2563eb';
const DEDUCTION_COLOR = '#dc2626';
const TEXT_DEFAULT_COLOR = '#171717';

// Sizes are expressed in BASE canvas-pixel units (the same space as the stored
// geometry) and scaled to PDF points per page. Fixed values mirror the shapes,
// which are themselves stored in base-pixel space.
const STROKE_BASE = 1.5;
const VERTEX_R_BASE = 4;
const COUNT_DOT_R_BASE = 6;
const COUNT_FONT_BASE = 13;
const FILL_OPACITY = 0.13;
const CIRCLE_SEGMENTS = 48;
const WHITESPACE = /\s+/;

export interface AnnotatedPdfInput {
	documentMethod: MeasurementMethod | null;
	geometryByPage: Map<number, PageGeometry>;
	globalWastage: number;
	legends: Record<number, Legend>;
	measurements: Measurement[];
	pageMethods: Record<number, MeasurementMethod>;
	// Burn each shape's actual measured value into a badge at its top edge.
	showMeasurements?: boolean;
	texts: TextAnnotation[];
}

function hexToRgb(hex: string) {
	const h = hex.replace('#', '');
	const value =
		h.length === 3
			? h
					.split('')
					.map((c) => c + c)
					.join('')
			: h;
	const r = Number.parseInt(value.slice(0, 2), 16) / 255;
	const g = Number.parseInt(value.slice(2, 4), 16) / 255;
	const b = Number.parseInt(value.slice(4, 6), 16) / 255;
	return rgb(
		Number.isNaN(r) ? 0 : r,
		Number.isNaN(g) ? 0 : g,
		Number.isNaN(b) ? 0 : b
	);
}

function resolveColor(
	m: Measurement,
	groupColors: Map<string, string>
): string {
	if (m.parentId) {
		return DEDUCTION_COLOR;
	}
	return (
		m.color ??
		(m.groupId ? groupColors.get(m.groupId) : undefined) ??
		TYPE_COLORS[m.type] ??
		FALLBACK_COLOR
	);
}

// Build an SVG path string (base-pixel coords) drawn via drawSvgPath, whose
// anchor (0, pageHeight) maps base-pixel (top-left, y-down) to PDF space.
function polyPath(points: Point[], close: boolean): string {
	if (points.length === 0) {
		return '';
	}
	const [first, ...rest] = points;
	let d = `M ${first.x} ${first.y}`;
	for (const p of rest) {
		d += ` L ${p.x} ${p.y}`;
	}
	return close ? `${d} Z` : d;
}

function circlePath(center: Point, radius: number): string {
	const pts: Point[] = [];
	for (let i = 0; i < CIRCLE_SEGMENTS; i++) {
		const angle = (i / CIRCLE_SEGMENTS) * Math.PI * 2;
		pts.push({
			x: center.x + Math.cos(angle) * radius,
			y: center.y + Math.sin(angle) * radius,
		});
	}
	return polyPath(pts, true);
}

function drawShape(
	page: PDFPage,
	m: Measurement,
	color: string,
	scaleFactor: number,
	pageHeight: number,
	font: PDFFont
) {
	const stroke = STROKE_BASE * scaleFactor;
	const rgbColor = hexToRgb(color);
	// Anchor maps already-scaled (point-space) path coords from a top-left,
	// y-down origin into PDF's bottom-left space.
	const anchor = { x: 0, y: pageHeight };
	const sp = (p: Point): Point => ({
		x: p.x * scaleFactor,
		y: p.y * scaleFactor,
	});
	const isDeduction = Boolean(m.parentId);
	const dash = isDeduction ? [stroke * 3, stroke * 2] : undefined;

	if (m.type === 'count') {
		// Each marker reads as the measurement name's first letter + its sequence
		// number (e.g. "Count" → C1, C2; "Electrical" → E1, E2), white-on-colour
		// inside the dot — mirroring the on-canvas markers.
		const prefix = (m.label.trim().charAt(0) || 'C').toUpperCase();
		const sizePts = COUNT_FONT_BASE * scaleFactor;
		for (let i = 0; i < m.points.length; i++) {
			const p = m.points[i];
			const label = `${prefix}${i + 1}`;
			// Grow the dot so multi-character labels (C12) stay legible.
			const rBase = Math.max(
				COUNT_DOT_R_BASE * 1.15,
				COUNT_FONT_BASE * 0.55 + label.length * COUNT_FONT_BASE * 0.32
			);
			page.drawSvgPath(circlePath(sp(p), rBase * scaleFactor), {
				...anchor,
				color: rgbColor,
				borderWidth: 0,
			});
			const tw = font.widthOfTextAtSize(label, sizePts);
			page.drawText(label, {
				x: p.x * scaleFactor - tw / 2,
				// Centre the baseline within the dot (≈0.35·size below the centre).
				y: pageHeight - p.y * scaleFactor - sizePts * 0.35,
				size: sizePts,
				font,
				color: rgb(1, 1, 1),
			});
		}
		return;
	}

	if (m.type === 'linear') {
		page.drawSvgPath(polyPath(m.points.map(sp), false), {
			...anchor,
			borderColor: rgbColor,
			borderWidth: stroke,
		});
		for (const p of m.points) {
			page.drawSvgPath(circlePath(sp(p), VERTEX_R_BASE * scaleFactor), {
				...anchor,
				color: rgbColor,
				borderWidth: 0,
			});
		}
		return;
	}

	// Area-like shapes: translucent fill + outline (dashed for deductions).
	let path: string;
	if (m.type === 'rectangle') {
		const b = rectBounds(m.points);
		path = polyPath(
			[
				sp({ x: b.x, y: b.y }),
				sp({ x: b.x + b.width, y: b.y }),
				sp({ x: b.x + b.width, y: b.y + b.height }),
				sp({ x: b.x, y: b.y + b.height }),
			],
			true
		);
	} else if (m.type === 'circle') {
		path = circlePath(sp(m.points[0]), circleRadius(m.points) * scaleFactor);
	} else {
		path = polyPath(m.points.map(sp), true);
	}
	page.drawSvgPath(path, {
		...anchor,
		color: rgbColor,
		opacity: FILL_OPACITY,
		borderColor: rgbColor,
		borderWidth: stroke,
		borderDashArray: dash,
	});
}

// Draw a stacked-line badge pill whose bottom edge sits a small gap above the
// given base-pixel anchor, mirroring the on-canvas MeasurementBadge.
function drawBadgePill(
	page: PDFPage,
	lines: string[],
	anchor: { x: number; y: number },
	color: string,
	scaleFactor: number,
	pageHeight: number,
	font: PDFFont
) {
	const sizePts = COUNT_FONT_BASE * scaleFactor;
	const padX = sizePts * 0.4;
	const padY = sizePts * 0.22;
	const lineHeight = sizePts * 1.25;
	const lineWidths = lines.map((line) => font.widthOfTextAtSize(line, sizePts));
	const width = Math.max(...lineWidths) + 2 * padX;
	const height = lines.length * lineHeight + 2 * padY;
	const gap = sizePts * 0.4;
	// PDF space: x scales directly; y flips about the page height. The anchor is
	// the shape/marker top, so the badge sits above it (higher PDF y).
	const cx = anchor.x * scaleFactor;
	const baseY = pageHeight - anchor.y * scaleFactor + gap;
	page.drawRectangle({
		x: cx - width / 2,
		y: baseY,
		width,
		height,
		color: rgb(1, 1, 1),
		opacity: 0.92,
		borderColor: hexToRgb(color),
		borderWidth: sizePts * 0.08,
	});
	// Stack lines top-to-bottom: PDF y grows upward, so the first line sits at the
	// highest y inside the pill.
	for (const [index, line] of lines.entries()) {
		const lineTop = baseY + height - padY - (index + 1) * lineHeight;
		page.drawText(line, {
			x: cx - lineWidths[index] / 2,
			y: lineTop + (lineHeight - sizePts) / 2,
			size: sizePts,
			font,
			color: hexToRgb(color),
		});
	}
}

// Burn a shape's actual measured value as a badge, mirroring the on-canvas
// MeasurementBadge: above the shape's top edge for linear/area, and above each
// marker dot for counts (the total marker count).
function drawValueBadge(
	page: PDFPage,
	m: Measurement,
	color: string,
	scaleFactor: number,
	pageHeight: number,
	font: PDFFont
) {
	const lines = shapeBadgeLines(m);
	if (lines.length === 0) {
		return;
	}
	if (m.type === 'count') {
		const prefix = (m.label.trim().charAt(0) || 'C').toUpperCase();
		for (let i = 0; i < m.points.length; i++) {
			const p = m.points[i];
			const label = `${prefix}${i + 1}`;
			// Match the marker dot radius so the badge clears the dot.
			const rBase = Math.max(
				COUNT_DOT_R_BASE * 1.15,
				COUNT_FONT_BASE * 0.55 + label.length * COUNT_FONT_BASE * 0.32
			);
			drawBadgePill(
				page,
				lines,
				{ x: p.x, y: p.y - rBase },
				color,
				scaleFactor,
				pageHeight,
				font
			);
		}
		return;
	}
	drawBadgePill(
		page,
		lines,
		shapeTopCenter(m),
		color,
		scaleFactor,
		pageHeight,
		font
	);
}

function wrapText(
	text: string,
	font: PDFFont,
	sizePts: number,
	maxWidthPts: number
): string[] {
	const lines: string[] = [];
	for (const rawLine of text.split('\n')) {
		const words = rawLine.split(WHITESPACE).filter(Boolean);
		if (words.length === 0) {
			lines.push('');
			continue;
		}
		let current = '';
		for (const word of words) {
			const trial = current ? `${current} ${word}` : word;
			if (current && font.widthOfTextAtSize(trial, sizePts) > maxWidthPts) {
				lines.push(current);
				current = word;
			} else {
				current = trial;
			}
		}
		if (current) {
			lines.push(current);
		}
	}
	return lines;
}

const LEGEND_MIN_FONT = 9;
const LEGEND_MAX_FONT = 64;

// A drawn text column in the legend: its x/width (points), font and colour.
interface LegendTextColumn {
	color: ReturnType<typeof rgb>;
	font: PDFFont;
	value: (entry: LegendExportEntry) => string;
	width: number;
	x: number;
}

interface LegendExportEntry {
	color: string;
	description: string;
	measurement: string;
	name: string;
}

function drawLegend(
	page: PDFPage,
	legend: Legend,
	measurements: Measurement[],
	scaleFactor: number,
	pageHeight: number,
	font: PDFFont,
	boldFont: PDFFont,
	globalWastage: number,
	mpp: number | null
) {
	const entries = buildLegendEntries(measurements, globalWastage, mpp);
	const showColor = legend.showColor ?? true;
	const showName = legend.showName ?? true;
	const showDescription = legend.showDescription ?? true;
	const showMeasurement = legend.showMeasurement ?? false;

	const fontBase = Math.min(
		LEGEND_MAX_FONT,
		Math.max(LEGEND_MIN_FONT, legend.width / 22)
	);
	const sizePts = fontBase * scaleFactor;
	const pad = fontBase * 0.5 * scaleFactor;
	const dot = fontBase * 0.9 * scaleFactor;
	const lineHeight = sizePts * 1.3;
	const widthPts = legend.width * scaleFactor;
	const leftPts = legend.x * scaleFactor;
	const topPts = pageHeight - legend.y * scaleFactor;

	// Fixed colour column, then proportional text columns sharing the remainder.
	const colorWidth = showColor ? dot + pad * 2 : 0;
	const specs: {
		weight: number;
		font: PDFFont;
		color: ReturnType<typeof rgb>;
		value: (e: LegendExportEntry) => string;
	}[] = [];
	if (showName) {
		specs.push({
			weight: 0.4,
			font: boldFont,
			color: rgb(0.09, 0.09, 0.09),
			value: (e) => e.name,
		});
	}
	if (showDescription) {
		specs.push({
			weight: 0.4,
			font,
			color: rgb(0.4, 0.4, 0.4),
			value: (e) => e.description,
		});
	}
	if (showMeasurement) {
		specs.push({
			weight: 0.2,
			font,
			color: rgb(0.25, 0.25, 0.25),
			value: (e) => e.measurement,
		});
	}

	const totalWeight = specs.reduce((sum, s) => sum + s.weight, 0) || 1;
	// Padding: leading gap after the colour column, one between each text column.
	const gaps = pad * (specs.length + 1);
	const availableText = Math.max(sizePts, widthPts - colorWidth - gaps);
	let columnX = leftPts + colorWidth + pad;
	const columns: LegendTextColumn[] = specs.map((spec) => {
		const colWidth = Math.max(
			sizePts,
			(availableText * spec.weight) / totalWeight
		);
		const column: LegendTextColumn = {
			color: spec.color,
			font: spec.font,
			value: spec.value,
			width: colWidth,
			x: columnX,
		};
		columnX += colWidth + pad;
		return column;
	});

	interface RowLayout {
		color: string;
		height: number;
		linesByColumn: string[][];
	}
	const layouts: RowLayout[] = entries.map((entry) => {
		const linesByColumn = columns.map((column) => {
			const text = column.value(entry);
			return text ? wrapText(text, column.font, sizePts, column.width) : [];
		});
		const rowLines = Math.max(1, ...linesByColumn.map((lines) => lines.length));
		return {
			color: entry.color,
			linesByColumn,
			height: Math.max(showColor ? dot : 0, rowLines * lineHeight) + pad * 2,
		};
	});

	const contentHeight = layouts.reduce((sum, r) => sum + r.height, 0);
	const boxHeight = entries.length === 0 ? lineHeight + pad * 2 : contentHeight;

	// Box background + border.
	page.drawRectangle({
		x: leftPts,
		y: topPts - boxHeight,
		width: widthPts,
		height: boxHeight,
		color: rgb(1, 1, 1),
		borderColor: rgb(0.82, 0.82, 0.82),
		borderWidth: Math.max(0.5, scaleFactor),
	});

	if (entries.length === 0) {
		page.drawText('No measurements on this page.', {
			x: leftPts + pad,
			y: topPts - pad - sizePts,
			size: sizePts,
			font,
			color: rgb(0.45, 0.45, 0.45),
		});
		return;
	}

	let cursorY = topPts;
	for (const row of layouts) {
		if (showColor) {
			// Colour dot (path pre-scaled to points; anchor flips into PDF space).
			page.drawSvgPath(
				circlePath({ x: leftPts + pad + dot / 2, y: 0 }, dot / 2),
				{
					x: 0,
					y: cursorY - pad - dot / 2,
					color: hexToRgb(row.color),
					borderWidth: 0,
				}
			);
		}
		columns.forEach((column, index) => {
			let lineY = cursorY - pad - sizePts;
			for (const line of row.linesByColumn[index]) {
				page.drawText(line, {
					x: column.x,
					y: lineY,
					size: sizePts,
					font: column.font,
					color: column.color,
				});
				lineY -= lineHeight;
			}
		});
		cursorY -= row.height;
	}
}

function drawTextAnnotation(
	page: PDFPage,
	annotation: TextAnnotation,
	scaleFactor: number,
	pageHeight: number,
	font: PDFFont
) {
	const fontBase = Math.min(96, Math.max(10, annotation.width / 12));
	const sizePts = fontBase * scaleFactor;
	const padding = fontBase * 0.3 * scaleFactor;
	const widthPts = annotation.width * scaleFactor;
	const heightPts = annotation.height * scaleFactor;
	const leftPts = annotation.x * scaleFactor;
	const topPts = pageHeight - annotation.y * scaleFactor;
	const lineHeight = sizePts * 1.3;
	const color = hexToRgb(annotation.color ?? TEXT_DEFAULT_COLOR);

	page.drawRectangle({
		x: leftPts,
		y: topPts - heightPts,
		width: widthPts,
		height: heightPts,
		color: rgb(1, 1, 1),
		opacity: 0.7,
		borderColor: rgb(0.82, 0.82, 0.82),
		borderWidth: Math.max(0.5, scaleFactor),
	});

	const lines = wrapText(
		annotation.text,
		font,
		sizePts,
		widthPts - padding * 2
	);
	let lineY = topPts - padding - sizePts;
	for (const line of lines) {
		if (lineY < topPts - heightPts) {
			break;
		}
		page.drawText(line, {
			x: leftPts + padding,
			y: lineY,
			size: sizePts,
			font,
			color,
		});
		lineY -= lineHeight;
	}
}

// Draw every overlay (shapes, text, legend) for a single page onto an already
// laid-out PDFPage. Shared by the full-document export and the single-page
// export so both render overlays identically.
function annotatePage(
	page: PDFPage,
	pageNumber: number,
	geometry: PageGeometry,
	input: AnnotatedPdfInput,
	font: PDFFont,
	boldFont: PDFFont,
	groupColors: Map<string, string>
) {
	const pageHeight = page.getHeight();
	// base-pixel → PDF point scale.
	const scaleFactor = geometry.naturalWidth / geometry.baseWidth;

	const pageMeasurements = input.measurements.filter(
		(m) => m.page === pageNumber && !m.hidden
	);
	for (const m of pageMeasurements) {
		drawShape(
			page,
			m,
			resolveColor(m, groupColors),
			scaleFactor,
			pageHeight,
			font
		);
	}
	// Value badges in a second pass so they sit above every shape body.
	if (input.showMeasurements) {
		for (const m of pageMeasurements) {
			drawValueBadge(
				page,
				m,
				resolveColor(m, groupColors),
				scaleFactor,
				pageHeight,
				font
			);
		}
	}

	for (const annotation of input.texts.filter((t) => t.page === pageNumber)) {
		drawTextAnnotation(page, annotation, scaleFactor, pageHeight, font);
	}

	const legend = input.legends[pageNumber];
	if (legend) {
		// Resolve this page's scale so combined area-group values match the panel.
		const method = input.pageMethods[pageNumber] ?? input.documentMethod;
		const mpp = method ? resolveMpp(method, geometry) : null;
		drawLegend(
			page,
			legend,
			// Legend mirrors the on-screen one: page-filtered, non-hidden.
			pageMeasurements,
			scaleFactor,
			pageHeight,
			font,
			boldFont,
			input.globalWastage,
			mpp
		);
	}
}

export async function buildAnnotatedPdf(
	originalBytes: Uint8Array,
	input: AnnotatedPdfInput
): Promise<Uint8Array> {
	const pdf = await PDFDocument.load(originalBytes);
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
	const groupColors = groupColorMap(input.measurements);
	const pages = pdf.getPages();

	for (let i = 0; i < pages.length; i++) {
		const pageNumber = i + 1;
		const geometry = input.geometryByPage.get(pageNumber);
		if (!geometry) {
			continue;
		}
		annotatePage(
			pages[i],
			pageNumber,
			geometry,
			input,
			font,
			boldFont,
			groupColors
		);
	}

	return await pdf.save();
}

// Build a PDF containing only the given pages (1-indexed) with their overlays
// burned in. Used by the "Download Page/Category/Group" actions so the user can
// export just a subset of the document. Pages are sorted ascending and
// de-duplicated; the original document is never modified.
export async function buildPagesAnnotatedPdf(
	originalBytes: Uint8Array,
	input: AnnotatedPdfInput,
	pageNumbers: number[]
): Promise<Uint8Array> {
	const ordered = [...new Set(pageNumbers)].sort((a, b) => a - b);
	const src = await PDFDocument.load(originalBytes);
	const out = await PDFDocument.create();
	// 1-indexed pages → 0-indexed array for copyPages.
	const copied = await out.copyPages(
		src,
		ordered.map((pageNumber) => pageNumber - 1)
	);
	const font = await out.embedFont(StandardFonts.Helvetica);
	const boldFont = await out.embedFont(StandardFonts.HelveticaBold);
	const groupColors = groupColorMap(input.measurements);

	for (let i = 0; i < ordered.length; i++) {
		const page = copied[i];
		out.addPage(page);
		const pageNumber = ordered[i];
		const geometry = input.geometryByPage.get(pageNumber);
		if (geometry) {
			annotatePage(
				page,
				pageNumber,
				geometry,
				input,
				font,
				boldFont,
				groupColors
			);
		}
	}

	return await out.save();
}

// Build a single-page PDF containing only `pageNumber` (1-indexed) with its
// overlays burned in. Used by the "Download Page" action so the user can view
// and download one page on its own.
export function buildPageAnnotatedPdf(
	originalBytes: Uint8Array,
	input: AnnotatedPdfInput,
	pageNumber: number
): Promise<Uint8Array> {
	return buildPagesAnnotatedPdf(originalBytes, input, [pageNumber]);
}
