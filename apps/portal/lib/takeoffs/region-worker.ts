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
	height: number;
	/** Int32Array buffer, transferred back. */
	labels: ArrayBuffer;
	regions: RegionInfo[];
	requestId: number;
	width: number;
}

self.onmessage = (event: MessageEvent<SegmentRequest>) => {
	const { buffer, gapClosePx, height, requestId, textRects, width } =
		event.data;
	const map = segmentImage(new Uint8ClampedArray(buffer), width, height, {
		gapClosePx,
		textRects,
	});
	const response: SegmentResponse = {
		height: map.height,
		labels: map.labels.buffer as ArrayBuffer,
		regions: map.regions,
		requestId,
		width: map.width,
	};
	self.postMessage(response, { transfer: [response.labels] });
};
