// Web Worker entry for the auto-detect tool's page segmentation. Thin wrapper —
// all algorithms live in region-detect.ts so they stay testable and reusable as
// a synchronous main-thread fallback.

import { type MaskRect, type RegionInfo, segmentImage } from './region-detect';

export interface SegmentRequest {
	/** ImageData.data.buffer, transferred. */
	buffer: ArrayBuffer;
	/** Closing radius (px) — seals wall gaps narrower than ~2×radius. */
	gapClosePx: number;
	height: number;
	requestId: number;
	textRects: MaskRect[];
	width: number;
}

export interface SegmentResponse {
	/** Int32Array buffer, transferred back. */
	coarseLabels: ArrayBuffer;
	coarseRegions: RegionInfo[];
	/** Int32Array buffer, transferred back. */
	fineLabels: ArrayBuffer;
	fineRegions: RegionInfo[];
	height: number;
	requestId: number;
	width: number;
}

self.onmessage = (event: MessageEvent<SegmentRequest>) => {
	const { buffer, gapClosePx, height, requestId, textRects, width } =
		event.data;
	const { coarse, fine } = segmentImage(
		new Uint8ClampedArray(buffer),
		width,
		height,
		{ gapClosePx, textRects }
	);
	const response: SegmentResponse = {
		coarseLabels: coarse.labels.buffer as ArrayBuffer,
		coarseRegions: coarse.regions,
		fineLabels: fine.labels.buffer as ArrayBuffer,
		fineRegions: fine.regions,
		height: coarse.height,
		requestId,
		width: coarse.width,
	};
	self.postMessage(response, {
		transfer: [response.coarseLabels, response.fineLabels],
	});
};
