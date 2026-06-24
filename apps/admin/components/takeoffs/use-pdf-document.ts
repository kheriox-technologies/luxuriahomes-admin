'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { buildTextBoxes, type TextBox } from '@/lib/takeoffs/text-layer';

// pdfjs is imported dynamically (client-only) so it never runs during SSR.
interface PdfDocument {
	getPage: (n: number) => Promise<PdfPage>;
	numPages: number;
}
interface PdfTextContent {
	items: { str?: string; transform?: number[]; width?: number }[];
}
interface PdfPage {
	getTextContent: () => Promise<PdfTextContent>;
	getViewport: (opts: { scale: number }) => PdfViewport;
	render: (opts: {
		canvasContext: CanvasRenderingContext2D;
		viewport: PdfViewport;
	}) => { promise: Promise<void>; cancel: () => void };
}
interface PdfViewport {
	height: number;
	transform: number[];
	width: number;
}

export interface RenderedSize {
	height: number;
	width: number;
}

// Cap the intrinsic raster size so very large architectural sheets stay
// performant while remaining sharp enough for accurate clicking.
const MAX_RENDER_WIDTH = 3200;

// Single source of truth for the render scale: shared by canvas rendering and
// text extraction so the text layer maps into the exact same pixel space as the
// drawn shapes.
function renderScale(naturalWidth: number): number {
	return Math.min(2, MAX_RENDER_WIDTH / naturalWidth);
}

export function usePdfDocument(url: string) {
	const [doc, setDoc] = useState<PdfDocument | null>(null);
	const [numPages, setNumPages] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const renderTaskRef = useRef<{ cancel: () => void } | null>(null);
	// Per-page text boxes, extracted once and reused (getTextContent is costly).
	const textCacheRef = useRef<Map<number, TextBox[]>>(new Map());

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const pdfjs = await import('pdfjs-dist');
				pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
				const loadingTask = pdfjs.getDocument({ url });
				const loaded = (await loadingTask.promise) as unknown as PdfDocument;
				if (cancelled) {
					return;
				}
				textCacheRef.current.clear();
				setDoc(loaded);
				setNumPages(loaded.numPages);
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to load PDF');
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [url]);

	const renderPage = useCallback(
		async (
			pageNumber: number,
			canvas: HTMLCanvasElement
		): Promise<RenderedSize | null> => {
			if (!doc) {
				return null;
			}
			renderTaskRef.current?.cancel();

			const page = await doc.getPage(pageNumber);
			const natural = page.getViewport({ scale: 1 });
			const scale = renderScale(natural.width);
			const viewport = page.getViewport({ scale });

			const context = canvas.getContext('2d');
			if (!context) {
				return null;
			}
			canvas.width = Math.floor(viewport.width);
			canvas.height = Math.floor(viewport.height);

			const task = page.render({ canvasContext: context, viewport });
			renderTaskRef.current = task;
			try {
				await task.promise;
			} catch {
				// Render was cancelled by a newer request; ignore.
				return null;
			}
			return { width: canvas.width, height: canvas.height };
		},
		[doc]
	);

	// Render a small thumbnail of a page. Independent of `renderTaskRef` so it
	// never cancels (or is cancelled by) the main stage render.
	const renderThumbnail = useCallback(
		async (
			pageNumber: number,
			canvas: HTMLCanvasElement,
			targetWidth: number
		): Promise<RenderedSize | null> => {
			if (!doc) {
				return null;
			}
			const page = await doc.getPage(pageNumber);
			const natural = page.getViewport({ scale: 1 });
			const scale = targetWidth / natural.width;
			const viewport = page.getViewport({ scale });

			const context = canvas.getContext('2d');
			if (!context) {
				return null;
			}
			canvas.width = Math.floor(viewport.width);
			canvas.height = Math.floor(viewport.height);

			try {
				await page.render({ canvasContext: context, viewport }).promise;
			} catch {
				return null;
			}
			return { width: canvas.width, height: canvas.height };
		},
		[doc]
	);

	// Extract the page's text layer as positioned boxes in base canvas pixel
	// space (same scale as renderPage), memoized per page. Empty for scanned PDFs
	// with no text layer.
	const extractText = useCallback(
		async (pageNumber: number): Promise<TextBox[]> => {
			if (!doc) {
				return [];
			}
			const cached = textCacheRef.current.get(pageNumber);
			if (cached) {
				return cached;
			}
			try {
				const page = await doc.getPage(pageNumber);
				const natural = page.getViewport({ scale: 1 });
				const viewport = page.getViewport({
					scale: renderScale(natural.width),
				});
				const content = await page.getTextContent();
				const boxes = buildTextBoxes(content.items, viewport.transform);
				textCacheRef.current.set(pageNumber, boxes);
				return boxes;
			} catch {
				return [];
			}
		},
		[doc]
	);

	return {
		numPages,
		renderPage,
		renderThumbnail,
		extractText,
		error,
		ready: doc !== null,
	};
}
