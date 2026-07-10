'use client';

import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	isUsableRegion,
	type MaskRect,
	type RegionMap,
	segmentImage,
	simplifyRing,
	traceRegionOutline,
} from '@/lib/takeoffs/region-detect';
import type {
	SegmentRequest,
	SegmentResponse,
} from '@/lib/takeoffs/region-worker';
import type { Point } from '@/lib/takeoffs/types';

export type RegionDetectionStatus =
	| 'idle'
	| 'segmenting'
	| 'ready'
	| 'unavailable';

interface UseRegionDetectionArgs {
	/** Whether the auto-detect tool is active (segmentation is lazy on this). */
	active: boolean;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	/** Morphological gap-closing radius, px — seals wall gaps (doorways)
	 * narrower than ~2×radius. */
	gapClosePx: number;
	/** Bumped by PdfStage after every page render — the sole invalidation key
	 * for the canvas raster (page change, document swap, re-render). */
	renderNonce: number;
	size: { height: number; width: number } | null;
	/** Text boxes (base px) to erase before labeling. Must be referentially
	 * stable per page — memoize in the parent. */
	textRects: MaskRect[];
}

/**
 * Owns the auto-detect tool's page segmentation lifecycle: reads the rendered
 * page canvas, segments it in a Web Worker (synchronous main-thread fallback if
 * worker construction fails), and exposes an O(1) point → region-outline lookup
 * for hover/click. The label map lives in a ref (hover must not re-render) and
 * traced contours are cached per region id, returning a stable array reference
 * so repeated hovers over one region bail out of state updates.
 */
export function useRegionDetection({
	active,
	canvasRef,
	gapClosePx,
	renderNonce,
	size,
	textRects,
}: UseRegionDetectionArgs): {
	hoverRegion: (point: Point) => Point[] | null;
	status: RegionDetectionStatus;
} {
	const [status, setStatus] = useState<RegionDetectionStatus>('idle');
	const mapRef = useRef<RegionMap | null>(null);
	const contourCacheRef = useRef(new Map<number, Point[] | null>());
	const workerRef = useRef<Worker | null>(null);
	const workerFailedRef = useRef(false);
	const requestIdRef = useRef(0);
	// The segmentation inputs the current map was computed from, so re-activating
	// the tool on an unchanged page reuses the map instead of re-segmenting.
	const computedForRef = useRef<string | null>(null);

	// One worker per mount; terminated on unmount.
	useEffect(() => {
		return () => {
			workerRef.current?.terminate();
			workerRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!(active && size && canvasRef.current)) {
			return;
		}
		// textRects participates via its length: the page's text layer loads
		// asynchronously, so the only same-nonce transition is empty → loaded
		// (cross-page changes always bump renderNonce).
		const inputsKey = `${renderNonce}:${gapClosePx}:${textRects.length}`;
		if (computedForRef.current === inputsKey && mapRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		if (!context || canvas.width < size.width || canvas.height < size.height) {
			return;
		}
		let imageData: ImageData;
		try {
			imageData = context.getImageData(0, 0, size.width, size.height);
		} catch {
			setStatus('unavailable');
			return;
		}
		mapRef.current = null;
		contourCacheRef.current.clear();
		computedForRef.current = inputsKey;
		const requestId = ++requestIdRef.current;
		setStatus('segmenting');

		const acceptMap = (map: RegionMap) => {
			if (requestId !== requestIdRef.current) {
				return;
			}
			mapRef.current = map;
			contourCacheRef.current.clear();
			setStatus('ready');
		};

		if (!(workerRef.current || workerFailedRef.current)) {
			try {
				workerRef.current = new Worker(
					new URL('../../lib/takeoffs/region-worker.ts', import.meta.url)
				);
			} catch {
				workerFailedRef.current = true;
			}
		}
		const worker = workerRef.current;
		if (worker) {
			worker.onmessage = (event: MessageEvent<SegmentResponse>) => {
				const { height, labels, regions, requestId: id, width } = event.data;
				if (id !== requestIdRef.current) {
					return;
				}
				acceptMap({ height, labels: new Int32Array(labels), regions, width });
			};
			worker.onerror = () => {
				if (requestId !== requestIdRef.current) {
					return;
				}
				setStatus('unavailable');
			};
			const request: SegmentRequest = {
				buffer: imageData.data.buffer as ArrayBuffer,
				gapClosePx,
				height: size.height,
				requestId,
				textRects,
				width: size.width,
			};
			worker.postMessage(request, [request.buffer]);
			return;
		}
		// Degraded main-thread fallback (blocks for the segmentation duration).
		acceptMap(
			segmentImage(imageData.data, size.width, size.height, {
				gapClosePx,
				textRects,
			})
		);
	}, [active, canvasRef, gapClosePx, renderNonce, size, textRects]);

	// Invalidate on raster change even while the tool is inactive, so stale
	// highlights can never surface after a page/document switch.
	useEffect(() => {
		if (computedForRef.current?.startsWith(`${renderNonce}:`)) {
			return;
		}
		mapRef.current = null;
		contourCacheRef.current.clear();
		setStatus('idle');
	}, [renderNonce]);

	const hoverRegion = useCallback((point: Point): Point[] | null => {
		const map = mapRef.current;
		if (!map) {
			return null;
		}
		const x = Math.round(point.x);
		const y = Math.round(point.y);
		if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
			return null;
		}
		const id = map.labels[y * map.width + x];
		if (!isUsableRegion(map, id)) {
			return null;
		}
		const cache = contourCacheRef.current;
		const cached = cache.get(id);
		if (cached !== undefined) {
			return cached;
		}
		const ring = simplifyRing(traceRegionOutline(map, id));
		const result = ring.length >= 3 ? ring : null;
		cache.set(id, result);
		return result;
	}, []);

	return { hoverRegion, status };
}
