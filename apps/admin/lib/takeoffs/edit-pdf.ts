import { PDFDocument } from 'pdf-lib';
import type {
	Legend,
	Measurement,
	MeasurementMethod,
	TextAnnotation,
} from './types';

// Page-indexed slices of the takeoff working set affected by a structural page
// edit. `documentMethod`/`globalWastage` are page-independent and untouched.
export interface PageIndexedState {
	legends: Record<number, Legend>;
	measurementPages: number[];
	measurements: Measurement[];
	pageMethods: Record<number, MeasurementMethod>;
	pageTitles: Record<number, string>;
	texts: TextAnnotation[];
}

// Shift a page-keyed record: drop the deleted page's entry (when `drop` matches)
// and move any entry past the edit point by `delta`.
function shiftRecord<T>(
	record: Record<number, T>,
	shouldShift: (page: number) => boolean,
	delta: number,
	shouldDrop: (page: number) => boolean = () => false
): Record<number, T> {
	const next: Record<number, T> = {};
	for (const [key, value] of Object.entries(record)) {
		const page = Number(key);
		if (shouldDrop(page)) {
			continue;
		}
		next[shouldShift(page) ? page + delta : page] = value;
	}
	return next;
}

// Copy a blank page in below page P (1-indexed): everything after P shifts up by
// one. The new page P+1 is left empty (only the PDF page itself is duplicated).
export function remapForCopy(
	state: PageIndexedState,
	targetPage: number
): PageIndexedState {
	const shiftUp = (page: number) => page > targetPage;
	return {
		measurements: state.measurements.map((m) =>
			shiftUp(m.page) ? { ...m, page: m.page + 1 } : m
		),
		measurementPages: state.measurementPages.map((p) =>
			shiftUp(p) ? p + 1 : p
		),
		texts: state.texts.map((t) =>
			shiftUp(t.page) ? { ...t, page: t.page + 1 } : t
		),
		legends: shiftRecord(
			// A Legend carries its own `page` field, so bump it alongside the key.
			Object.fromEntries(
				Object.entries(state.legends).map(([key, legend]) => {
					const page = Number(key);
					return [key, shiftUp(page) ? { ...legend, page: page + 1 } : legend];
				})
			),
			shiftUp,
			1
		),
		pageMethods: shiftRecord(state.pageMethods, shiftUp, 1),
		pageTitles: shiftRecord(state.pageTitles, shiftUp, 1),
	};
}

// Delete page P (1-indexed): drop everything on P, then shift everything after P
// down by one.
export function remapForDelete(
	state: PageIndexedState,
	targetPage: number
): PageIndexedState {
	const shiftDown = (page: number) => page > targetPage;
	const onTarget = (page: number) => page === targetPage;
	return {
		measurements: state.measurements
			.filter((m) => m.page !== targetPage)
			.map((m) => (shiftDown(m.page) ? { ...m, page: m.page - 1 } : m)),
		measurementPages: state.measurementPages
			.filter((p) => p !== targetPage)
			.map((p) => (shiftDown(p) ? p - 1 : p)),
		texts: state.texts
			.filter((t) => t.page !== targetPage)
			.map((t) => (shiftDown(t.page) ? { ...t, page: t.page - 1 } : t)),
		legends: shiftRecord(
			Object.fromEntries(
				Object.entries(state.legends).map(([key, legend]) => {
					const page = Number(key);
					return [
						key,
						shiftDown(page) ? { ...legend, page: page - 1 } : legend,
					];
				})
			),
			shiftDown,
			-1,
			onTarget
		),
		pageMethods: shiftRecord(state.pageMethods, shiftDown, -1, onTarget),
		pageTitles: shiftRecord(state.pageTitles, shiftDown, -1, onTarget),
	};
}

// Duplicate page P (1-indexed) in the PDF and insert the copy directly after it,
// returning the restructured PDF bytes. Only the page is copied.
export async function copyPageInPdf(
	bytes: Uint8Array,
	targetPage: number
): Promise<Uint8Array> {
	const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
	const [copied] = await pdf.copyPages(pdf, [targetPage - 1]);
	// 0-based index `targetPage` lands the copy right after the original page.
	pdf.insertPage(targetPage, copied);
	return await pdf.save();
}

// Remove page P (1-indexed) from the PDF, returning the restructured bytes.
export async function removePageInPdf(
	bytes: Uint8Array,
	targetPage: number
): Promise<Uint8Array> {
	const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
	pdf.removePage(targetPage - 1);
	return await pdf.save();
}
