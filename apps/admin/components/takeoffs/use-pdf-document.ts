'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// pdfjs is imported dynamically (client-only) so it never runs during SSR.
interface PdfDocument {
	getPage: (n: number) => Promise<PdfPage>;
	numPages: number;
}
interface PdfPage {
	getViewport: (opts: { scale: number }) => PdfViewport;
	render: (opts: {
		canvasContext: CanvasRenderingContext2D;
		viewport: PdfViewport;
	}) => { promise: Promise<void>; cancel: () => void };
}
interface PdfViewport {
	height: number;
	width: number;
}

export interface RenderedSize {
	height: number;
	width: number;
}

// Cap the intrinsic raster size so very large architectural sheets stay
// performant while remaining sharp enough for accurate clicking.
const MAX_RENDER_WIDTH = 3200;

export function usePdfDocument(url: string) {
	const [doc, setDoc] = useState<PdfDocument | null>(null);
	const [numPages, setNumPages] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

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
			const scale = Math.min(2, MAX_RENDER_WIDTH / natural.width);
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

	return { numPages, renderPage, error, ready: doc !== null };
}
