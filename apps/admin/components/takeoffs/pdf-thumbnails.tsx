'use client';

import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import { useEffect, useRef, useState } from 'react';
import type { RenderedSize } from './use-pdf-document';

// Internal raster resolution for thumbnails; the canvas is displayed at the
// card's full width, so this only controls sharpness, not layout.
const THUMB_WIDTH = 150;
// A3 landscape ratio (width / height) used only as the placeholder box shape
// before a page's real aspect ratio is known.
const A3_LANDSCAPE_RATIO = 420 / 297;

interface PdfThumbnailsProps {
	currentPage: number;
	numPages: number;
	onSelectPage: (page: number) => void;
	pagesWithMeasurements: Set<number>;
	ready: boolean;
	renderThumbnail: (
		pageNumber: number,
		canvas: HTMLCanvasElement,
		targetWidth: number
	) => Promise<RenderedSize | null>;
}

export default function PdfThumbnails({
	numPages,
	currentPage,
	onSelectPage,
	pagesWithMeasurements,
	renderThumbnail,
	ready,
}: PdfThumbnailsProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	if (!numPages) {
		return null;
	}

	return (
		<ScrollArea
			className="h-full w-[166px] shrink-0 rounded-lg border bg-card"
			ref={rootRef}
		>
			<div className="flex flex-col gap-2 p-2">
				{Array.from({ length: numPages }, (_, index) => index + 1).map(
					(pageNumber) => (
						<Thumbnail
							active={pageNumber === currentPage}
							hasMeasurements={pagesWithMeasurements.has(pageNumber)}
							key={pageNumber}
							onSelect={onSelectPage}
							pageNumber={pageNumber}
							ready={ready}
							renderThumbnail={renderThumbnail}
							scrollRoot={rootRef}
						/>
					)
				)}
			</div>
		</ScrollArea>
	);
}

function Thumbnail({
	pageNumber,
	active,
	hasMeasurements,
	onSelect,
	renderThumbnail,
	ready,
	scrollRoot,
}: {
	pageNumber: number;
	active: boolean;
	hasMeasurements: boolean;
	onSelect: (page: number) => void;
	renderThumbnail: PdfThumbnailsProps['renderThumbnail'];
	ready: boolean;
	scrollRoot: React.RefObject<HTMLDivElement | null>;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	// height / width of the rendered page; null until the thumbnail renders.
	const [aspect, setAspect] = useState<number | null>(null);
	const [visible, setVisible] = useState(false);

	// Reveal the thumbnail the first time it scrolls into view (lazy raster).
	useEffect(() => {
		const node = buttonRef.current;
		if (!node || visible) {
			return;
		}
		// The actual scrolling element is ScrollArea's viewport, not its root.
		const viewport = scrollRoot.current?.querySelector(
			'[data-slot="scroll-area-viewport"]'
		);
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ root: viewport ?? null, rootMargin: '200px' }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [visible, scrollRoot]);

	useEffect(() => {
		if (!(ready && visible && canvasRef.current)) {
			return;
		}
		let activeRender = true;
		(async () => {
			const dpr = window.devicePixelRatio || 1;
			const rendered = await renderThumbnail(
				pageNumber,
				canvasRef.current as HTMLCanvasElement,
				THUMB_WIDTH * dpr
			);
			if (activeRender && rendered) {
				setAspect(rendered.height / rendered.width);
			}
		})();
		return () => {
			activeRender = false;
		};
	}, [ready, visible, pageNumber, renderThumbnail]);

	// width / height — fills the card width and derives height from the ratio.
	const aspectRatio = aspect ? 1 / aspect : A3_LANDSCAPE_RATIO;

	return (
		<button
			aria-current={active ? 'page' : undefined}
			aria-label={`Go to page ${pageNumber}`}
			className={cn(
				'group relative block w-full shrink-0 overflow-hidden rounded-md border-2 bg-muted/40 transition-colors',
				active
					? 'border-primary ring-2 ring-primary/40'
					: 'border-transparent hover:border-muted-foreground/40'
			)}
			onClick={() => onSelect(pageNumber)}
			ref={buttonRef}
			style={{ aspectRatio }}
			type="button"
		>
			<canvas
				className="absolute inset-0 h-full w-full object-contain"
				ref={canvasRef}
			/>
			{hasMeasurements && (
				<span
					className="absolute top-1 right-1 rounded bg-primary px-1.5 py-0.5 font-semibold text-[10px] text-primary-foreground shadow-sm"
					title="Has measurements"
				>
					M
				</span>
			)}
			<span className="absolute right-1 bottom-1 rounded bg-background/90 px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground tabular-nums shadow-sm">
				{pageNumber}
			</span>
		</button>
	);
}
