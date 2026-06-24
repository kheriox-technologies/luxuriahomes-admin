import {
	PDFDocument,
	type PDFFont,
	type PDFPage,
	rgb,
	StandardFonts,
} from 'pdf-lib';
import { buildRows } from '@/components/takeoffs/measurements-panel';
import {
	circleRadius,
	groupColorMap,
	rectBounds,
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
		for (let i = 0; i < m.points.length; i++) {
			const p = m.points[i];
			page.drawSvgPath(circlePath(sp(p), COUNT_DOT_R_BASE * scaleFactor), {
				...anchor,
				color: rgbColor,
				borderWidth: 0,
			});
			const label = String(i + 1);
			const sizePts = COUNT_FONT_BASE * scaleFactor;
			const tw = font.widthOfTextAtSize(label, sizePts);
			page.drawText(label, {
				x: p.x * scaleFactor - tw / 2,
				y: pageHeight - (p.y - COUNT_DOT_R_BASE * 2.2) * scaleFactor,
				size: sizePts,
				font,
				color: rgbColor,
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

function drawLegend(
	page: PDFPage,
	legend: Legend,
	measurements: Measurement[],
	scaleFactor: number,
	pageHeight: number,
	font: PDFFont,
	boldFont: PDFFont
) {
	const rows = buildRows(measurements);
	const entries = rows.map((row) => {
		if (row.kind === 'group') {
			return {
				color: row.members[0].color ?? FALLBACK_COLOR,
				name: row.label,
				description: row.members.find((m) => m.description)?.description ?? '',
			};
		}
		return {
			color: row.measurement.color ?? FALLBACK_COLOR,
			name: row.measurement.label,
			description: row.measurement.description ?? '',
		};
	});

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

	const dotCol = dot + pad * 2;
	const textColStart = leftPts + dotCol;
	const remaining = widthPts - dotCol - pad;
	const nameWidth = Math.max(remaining * 0.45, sizePts);
	const descWidth = Math.max(remaining * 0.55 - pad, sizePts);

	interface RowLayout {
		color: string;
		descLines: string[];
		height: number;
		nameLines: string[];
	}
	const layouts: RowLayout[] = entries.map((entry) => {
		const nameLines = wrapText(entry.name, boldFont, sizePts, nameWidth);
		const descLines = entry.description
			? wrapText(entry.description, font, sizePts, descWidth)
			: [];
		const rowLines = Math.max(nameLines.length, descLines.length, 1);
		return {
			color: entry.color,
			nameLines,
			descLines,
			height: Math.max(dot, rowLines * lineHeight) + pad * 2,
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
		// Name (bold) lines.
		let lineY = cursorY - pad - sizePts;
		for (const line of row.nameLines) {
			page.drawText(line, {
				x: textColStart,
				y: lineY,
				size: sizePts,
				font: boldFont,
				color: rgb(0.09, 0.09, 0.09),
			});
			lineY -= lineHeight;
		}
		// Description lines.
		let descY = cursorY - pad - sizePts;
		for (const line of row.descLines) {
			page.drawText(line, {
				x: textColStart + nameWidth + pad,
				y: descY,
				size: sizePts,
				font,
				color: rgb(0.4, 0.4, 0.4),
			});
			descY -= lineHeight;
		}
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
		const page = pages[i];
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

		for (const annotation of input.texts.filter((t) => t.page === pageNumber)) {
			drawTextAnnotation(page, annotation, scaleFactor, pageHeight, font);
		}

		const legend = input.legends[pageNumber];
		if (legend) {
			drawLegend(
				page,
				legend,
				// Legend mirrors the on-screen one: page-filtered, non-hidden.
				pageMeasurements,
				scaleFactor,
				pageHeight,
				font,
				boldFont
			);
		}
	}

	return await pdf.save();
}
