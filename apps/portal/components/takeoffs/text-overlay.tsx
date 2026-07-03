'use client';

import { GripHorizontal, X } from 'lucide-react';
import { type ReactElement, useEffect, useRef } from 'react';
import type { TextAnnotation } from '@/lib/takeoffs/types';

// Clamp bounds for the text box (base canvas px).
const MIN_WIDTH = 60;
const MAX_WIDTH = 2400;
const MIN_HEIGHT = 32;
const MAX_HEIGHT = 2400;
// Font size is derived from the box width so the text scales with the box when
// resized, then clamped so it never becomes unreadably small or absurdly large
// (base px). A smaller divisor than the legend's gives roomier annotation text.
const FONT_DIVISOR = 12;
const MIN_FONT = 10;
const MAX_FONT = 96;
// Default text colour when the annotation has none set (dark neutral).
const DEFAULT_COLOR = '#171717';
// Keyboard step (base px) for nudging size via the resize handle.
const NUDGE_STEP = 8;

interface TextChange {
	height: number;
	width: number;
	x: number;
	y: number;
}

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

export default function TextOverlay({
	annotation,
	scale,
	autoFocus,
	onChange,
	onTextChange,
	onColorChange,
	onRemove,
	onAutoFocused,
}: {
	annotation: TextAnnotation;
	/** Current zoom scale, to convert screen-pixel drags to base-pixel deltas. */
	scale: number;
	/** Focus the textarea on mount (a just-placed box). */
	autoFocus: boolean;
	onChange: (next: TextChange) => void;
	onTextChange: (text: string) => void;
	onColorChange: (color: string) => void;
	onRemove: () => void;
	/** Called once the autoFocus has been consumed, so the parent can clear it. */
	onAutoFocused: () => void;
}): ReactElement {
	const { x, y, width, height, text } = annotation;
	const color = annotation.color ?? DEFAULT_COLOR;
	const fontSize = clamp(width / FONT_DIVISOR, MIN_FONT, MAX_FONT);
	const grip = fontSize * 1.1;
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (autoFocus && textareaRef.current) {
			textareaRef.current.focus();
			onAutoFocused();
		}
	}, [autoFocus, onAutoFocused]);

	// The zoom/pan wrapper starts a pan from a native mousedown on `window`, which
	// also prevents the textarea from focusing. Swallow mousedown at the box (a
	// descendant of the wrapper) so it never reaches that listener. Only mousedown
	// is stopped, so pointer-driven move/resize and click handlers still fire, and
	// not calling preventDefault keeps the textarea focusable.
	useEffect(() => {
		const node = boxRef.current;
		if (!node) {
			return;
		}
		const stop = (event: MouseEvent) => event.stopPropagation();
		node.addEventListener('mousedown', stop);
		return () => node.removeEventListener('mousedown', stop);
	}, []);

	// Drag the top grip to move the box. Screen deltas are divided by the zoom
	// scale so the box tracks the pointer 1:1 on screen at any zoom (mirrors the
	// legend overlay's move handler).
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
				height,
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

	// Drag the corner handle to resize both width and height; the font follows the
	// width, so the text scales with the box.
	const startResize = (event: React.PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const startX = event.clientX;
		const startY = event.clientY;
		const startWidth = width;
		const startHeight = height;
		const dragScale = scale || 1;
		const prevCursor = document.body.style.cursor;
		const prevSelect = document.body.style.userSelect;
		document.body.style.cursor = 'nwse-resize';
		document.body.style.userSelect = 'none';
		const onMove = (moveEvent: PointerEvent) => {
			onChange({
				x,
				y,
				width: clamp(
					startWidth + (moveEvent.clientX - startX) / dragScale,
					MIN_WIDTH,
					MAX_WIDTH
				),
				height: clamp(
					startHeight + (moveEvent.clientY - startY) / dragScale,
					MIN_HEIGHT,
					MAX_HEIGHT
				),
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
		const deltas: Record<string, { dh: number; dw: number }> = {
			ArrowRight: { dw: NUDGE_STEP, dh: 0 },
			ArrowLeft: { dw: -NUDGE_STEP, dh: 0 },
			ArrowDown: { dw: 0, dh: NUDGE_STEP },
			ArrowUp: { dw: 0, dh: -NUDGE_STEP },
		};
		const step = deltas[event.key];
		if (!step) {
			return;
		}
		event.preventDefault();
		onChange({
			x,
			y,
			width: clamp(width + step.dw, MIN_WIDTH, MAX_WIDTH),
			height: clamp(height + step.dh, MIN_HEIGHT, MAX_HEIGHT),
		});
	};

	// Discard a box that is left empty (e.g. placed then clicked away) so the
	// canvas never accumulates invisible boxes.
	const onBlur = () => {
		if (text.trim() === '') {
			onRemove();
		}
	};

	return (
		<div
			className="absolute box-border overflow-hidden rounded-md border border-neutral-300 bg-white/70 text-neutral-900 shadow-sm"
			ref={boxRef}
			style={{
				left: x,
				top: y,
				width,
				height,
				fontSize,
				pointerEvents: 'auto',
			}}
		>
			<div className="relative" style={{ height: grip }}>
				<button
					aria-label="Move text"
					className="flex w-full cursor-grab touch-none items-center justify-center bg-neutral-100 text-neutral-400 outline-none hover:text-neutral-700 active:cursor-grabbing"
					onPointerDown={startMove}
					style={{ height: grip }}
					type="button"
				>
					<GripHorizontal style={{ width: grip * 0.8, height: grip * 0.8 }} />
				</button>
				<input
					aria-label="Text colour"
					className="absolute top-1/2 left-1 cursor-pointer rounded-sm border-0 bg-transparent p-0"
					onChange={(event) => onColorChange(event.target.value)}
					onPointerDown={(event) => event.stopPropagation()}
					style={{
						width: grip * 0.7,
						height: grip * 0.7,
						transform: 'translateY(-50%)',
					}}
					type="color"
					value={color}
				/>
			</div>

			<button
				aria-label="Remove text"
				className="absolute top-0 right-0 z-10 flex items-center justify-center text-neutral-400 outline-none hover:text-neutral-900"
				onClick={onRemove}
				onPointerDown={(event) => event.stopPropagation()}
				style={{ padding: grip * 0.15 }}
				type="button"
			>
				<X style={{ width: grip * 0.7, height: grip * 0.7 }} />
			</button>

			<textarea
				className="block w-full resize-none border-0 bg-transparent outline-none"
				onBlur={onBlur}
				onChange={(event) => onTextChange(event.target.value)}
				placeholder="Text"
				ref={textareaRef}
				style={{
					height: `calc(100% - ${grip}px)`,
					color,
					fontSize: 'inherit',
					lineHeight: 1.3,
					padding: fontSize * 0.3,
				}}
				value={text}
			/>

			<button
				aria-label="Resize text"
				className="absolute right-0 bottom-0 cursor-nwse-resize touch-none outline-none"
				onKeyDown={onResizeKey}
				onPointerDown={startResize}
				style={{ width: grip * 1.6, height: grip * 1.6 }}
				type="button"
			>
				<span
					className="absolute right-1 bottom-1 rounded-sm border-neutral-400 border-r-2 border-b-2"
					style={{ width: grip * 0.7, height: grip * 0.7 }}
				/>
			</button>
		</div>
	);
}
