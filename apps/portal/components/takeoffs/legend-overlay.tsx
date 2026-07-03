'use client';

import { X } from 'lucide-react';
import type { ReactElement } from 'react';
import type { Legend, Measurement } from '@/lib/takeoffs/types';
import { buildLegendEntries } from './measurements-panel';

// Clamp bounds for the legend box width (base canvas px).
const MIN_LEGEND_WIDTH = 160;
const MAX_LEGEND_WIDTH = 2400;
// Font size is derived from width so the table reads sensibly at any page size,
// then clamped so it never becomes unreadably small or absurdly large (base px).
const MIN_FONT = 9;
const MAX_FONT = 64;
// Keyboard step (base px) for nudging position / width via the handles.
const NUDGE_STEP = 8;

interface LegendChange {
	width: number;
	x: number;
	y: number;
}

export default function LegendOverlay({
	legend,
	measurements,
	globalWastage,
	scale,
	onChange,
	onRemove,
}: {
	legend: Legend;
	/** All non-hidden measurements on this page; filtered to the legend's group. */
	measurements: Measurement[];
	/** Document wastage default, used to round the optional measurement column. */
	globalWastage: number;
	/** Current zoom scale, to convert screen-pixel drags to base-pixel deltas. */
	scale: number;
	onChange: (next: LegendChange) => void;
	onRemove: () => void;
}): ReactElement {
	const { x, y, width } = legend;
	const entries = buildLegendEntries(
		measurements.filter((m) => m.groupId === legend.groupId),
		globalWastage
	);
	const showColor = legend.showColor ?? true;
	const showName = legend.showName ?? true;
	const showDescription = legend.showDescription ?? true;
	const showMeasurement = legend.showMeasurement ?? false;
	const fontSize = Math.min(MAX_FONT, Math.max(MIN_FONT, width / 22));
	const pad = fontSize * 0.5;
	const dot = fontSize * 0.9;

	// Drag the title bar to move the box. Screen deltas are divided by the zoom
	// scale so the box tracks the pointer 1:1 on screen at any zoom (mirrors the
	// panel-resize handler in takeoffs-content).
	const startMove = (event: React.PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const startX = event.clientX;
		const startY = event.clientY;
		const originX = x;
		const originY = y;
		const dragScale = scale || 1;
		const prevCursor = document.body.style.cursor;
		const prevSelect = document.body.style.userSelect;
		document.body.style.cursor = 'grabbing';
		document.body.style.userSelect = 'none';
		const onMove = (moveEvent: PointerEvent) => {
			onChange({
				x: originX + (moveEvent.clientX - startX) / dragScale,
				y: originY + (moveEvent.clientY - startY) / dragScale,
				width,
			});
		};
		const onUp = () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			document.body.style.cursor = prevCursor;
			document.body.style.userSelect = prevSelect;
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	};

	// Drag the corner handle to resize the width (height follows content).
	const startResize = (event: React.PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const startX = event.clientX;
		const startWidth = width;
		const dragScale = scale || 1;
		const prevCursor = document.body.style.cursor;
		const prevSelect = document.body.style.userSelect;
		document.body.style.cursor = 'ew-resize';
		document.body.style.userSelect = 'none';
		const onMove = (moveEvent: PointerEvent) => {
			const next = startWidth + (moveEvent.clientX - startX) / dragScale;
			onChange({
				x,
				y,
				width: Math.min(MAX_LEGEND_WIDTH, Math.max(MIN_LEGEND_WIDTH, next)),
			});
		};
		const onUp = () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			document.body.style.cursor = prevCursor;
			document.body.style.userSelect = prevSelect;
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	};

	const onResizeKey = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const next =
				width + (event.key === 'ArrowRight' ? NUDGE_STEP : -NUDGE_STEP);
			onChange({
				x,
				y,
				width: Math.min(MAX_LEGEND_WIDTH, Math.max(MIN_LEGEND_WIDTH, next)),
			});
		}
	};

	return (
		<div
			// Drag anywhere on the box to move it; the move handler stops propagation
			// so it never starts a pan/zoom on the underlying canvas.
			className="absolute cursor-grab touch-none overflow-hidden rounded-md border border-neutral-300 bg-white text-neutral-900 shadow-lg active:cursor-grabbing"
			onPointerDown={startMove}
			style={{
				left: x,
				top: y,
				width,
				fontSize,
				pointerEvents: 'auto',
			}}
		>
			<button
				aria-label="Remove legend"
				className="absolute top-0 right-0 z-10 flex items-center justify-center text-neutral-400 outline-none hover:text-neutral-900"
				onClick={onRemove}
				onPointerDown={(event) => event.stopPropagation()}
				style={{ padding: pad * 0.6 }}
				type="button"
			>
				<X style={{ width: dot, height: dot }} />
			</button>

			{entries.length === 0 ? (
				<p className="text-neutral-500" style={{ padding: pad }}>
					No measurements on this page.
				</p>
			) : (
				<table className="w-full border-collapse text-left">
					<tbody>
						{entries.map((entry) => (
							<tr
								className="border-neutral-200 border-b last:border-0"
								key={entry.id}
							>
								{showColor && (
									<td
										className="align-top"
										style={{ padding: pad, width: dot + pad * 2 }}
									>
										<span
											className="inline-block rounded-full"
											style={{
												backgroundColor: entry.color,
												width: dot,
												height: dot,
											}}
										/>
									</td>
								)}
								{showName && (
									<td
										className="align-top font-medium"
										style={{ padding: pad, paddingLeft: showColor ? 0 : pad }}
									>
										{entry.name}
									</td>
								)}
								{showDescription && (
									<td
										className="align-top text-neutral-600"
										style={{ padding: pad, paddingLeft: 0 }}
									>
										{entry.description}
									</td>
								)}
								{showMeasurement && (
									<td
										className="whitespace-nowrap text-right align-top text-neutral-700"
										style={{ padding: pad, paddingLeft: 0 }}
									>
										{entry.measurement}
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			)}

			<button
				aria-label="Resize legend"
				className="absolute right-0 bottom-0 cursor-ew-resize touch-none outline-none"
				onKeyDown={onResizeKey}
				onPointerDown={startResize}
				style={{ width: dot * 1.6, height: dot * 1.6 }}
				type="button"
			>
				<span
					className="absolute right-1 bottom-1 rounded-sm border-neutral-400 border-r-2 border-b-2"
					style={{ width: dot * 0.7, height: dot * 0.7 }}
				/>
			</button>
		</div>
	);
}
