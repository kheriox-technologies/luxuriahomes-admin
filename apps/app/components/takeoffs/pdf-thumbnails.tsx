'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Switch } from '@workspace/ui/components/switch';
import { cn } from '@workspace/ui/lib/utils';
import { Crosshair, EllipsisVertical, RotateCcw, Ruler } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatMethodLabel } from '@/lib/takeoffs/geometry';
import type { MeasurementMethod, MethodScope } from '@/lib/takeoffs/types';
import { InlineTitle } from './inline-title';
import type { RenderedSize } from './use-pdf-document';

// Internal raster resolution for thumbnails; the canvas is displayed at the
// card's full width, so this only controls sharpness, not layout.
const THUMB_WIDTH = 150;
// A3 landscape ratio (width / height) used only as the placeholder box shape
// before a page's real aspect ratio is known.
const A3_LANDSCAPE_RATIO = 420 / 297;

interface PdfThumbnailsProps {
	currentPage: number;
	// --- Per-page scaling (moved here from the measurements panel) ---
	documentMethod: MeasurementMethod | null;
	numPages: number;
	onCalibrate: (scope: MethodScope, targetPage: number) => void;
	onOpenScaleDialog: (scope: MethodScope, targetPage: number) => void;
	onRenamePage: (page: number, title: string) => void;
	onResetPage: (targetPage: number) => void;
	onSelectPage: (page: number) => void;
	/** Toggles between showing all pages and only pages with measurements. */
	onToggleShowAll: (on: boolean) => void;
	pageMethods: Record<number, MeasurementMethod>;
	pagesWithMeasurements: Set<number>;
	pageTitles: Record<number, string>;
	ready: boolean;
	renderThumbnail: (
		pageNumber: number,
		canvas: HTMLCanvasElement,
		targetWidth: number
	) => Promise<RenderedSize | null>;
	/** Whether all pages are shown (vs only pages with measurements). */
	showAllPages: boolean;
	/** Page numbers to render, in display order. */
	visiblePages: number[];
}

export default function PdfThumbnails({
	numPages,
	currentPage,
	onRenamePage,
	onSelectPage,
	onToggleShowAll,
	pagesWithMeasurements,
	pageTitles,
	renderThumbnail,
	ready,
	showAllPages,
	visiblePages,
	documentMethod,
	pageMethods,
	onOpenScaleDialog,
	onCalibrate,
	onResetPage,
}: PdfThumbnailsProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	if (!numPages) {
		return null;
	}

	return (
		<div className="flex h-full w-[166px] shrink-0 flex-col rounded-lg border bg-card">
			<div className="flex items-center gap-2 border-b px-3 py-2">
				<Switch
					checked={showAllPages}
					id="show-all-pages-toggle"
					onCheckedChange={onToggleShowAll}
				/>
				<Label htmlFor="show-all-pages-toggle">Show All</Label>
			</div>
			<ScrollArea className="min-h-0 flex-1" ref={rootRef}>
				<div className="flex flex-col gap-2 p-2">
					{visiblePages.map((pageNumber) => (
						<Thumbnail
							active={pageNumber === currentPage}
							documentMethod={documentMethod}
							hasMeasurements={pagesWithMeasurements.has(pageNumber)}
							key={pageNumber}
							method={pageMethods[pageNumber] ?? documentMethod}
							onCalibrate={onCalibrate}
							onOpenScaleDialog={onOpenScaleDialog}
							onRenamePage={onRenamePage}
							onResetPage={onResetPage}
							onSelect={onSelectPage}
							overridden={pageMethods[pageNumber] !== undefined}
							pageNumber={pageNumber}
							pageTitle={pageTitles[pageNumber] ?? `Page ${pageNumber}`}
							ready={ready}
							renderThumbnail={renderThumbnail}
							scrollRoot={rootRef}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

function Thumbnail({
	pageNumber,
	active,
	hasMeasurements,
	onRenamePage,
	onSelect,
	pageTitle,
	renderThumbnail,
	ready,
	scrollRoot,
	method,
	documentMethod,
	overridden,
	onOpenScaleDialog,
	onCalibrate,
	onResetPage,
}: {
	pageNumber: number;
	active: boolean;
	hasMeasurements: boolean;
	onRenamePage: (page: number, title: string) => void;
	onSelect: (page: number) => void;
	pageTitle: string;
	renderThumbnail: PdfThumbnailsProps['renderThumbnail'];
	ready: boolean;
	scrollRoot: React.RefObject<HTMLDivElement | null>;
	method: MeasurementMethod | null;
	documentMethod: MeasurementMethod | null;
	overridden: boolean;
	onOpenScaleDialog: (scope: MethodScope, targetPage: number) => void;
	onCalibrate: (scope: MethodScope, targetPage: number) => void;
	onResetPage: (targetPage: number) => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	// height / width of the rendered page; null until the thumbnail renders.
	const [aspect, setAspect] = useState<number | null>(null);
	const [visible, setVisible] = useState(false);

	// Reveal the thumbnail the first time it scrolls into view (lazy raster).
	useEffect(() => {
		const node = containerRef.current;
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

	// Pages with measurements use the info accent; the selected page gets a more
	// prominent border + ring.
	let cardBorderClass: string;
	if (hasMeasurements) {
		cardBorderClass = active
			? 'border-info ring-2 ring-info/40'
			: 'border-info/60 hover:border-info';
	} else {
		cardBorderClass = active
			? 'border-primary ring-2 ring-primary/40'
			: 'border-border hover:border-muted-foreground/40';
	}

	const scaleLabel = method ? formatMethodLabel(method) : 'Not set';

	return (
		<div className="relative w-full shrink-0" ref={containerRef}>
			<div
				className={cn(
					'overflow-hidden rounded-md border-2 bg-card transition-colors',
					cardBorderClass
				)}
			>
				<button
					aria-current={active ? 'page' : undefined}
					aria-label={`Go to page ${pageNumber}`}
					className="group relative block w-full bg-muted/40"
					onClick={() => onSelect(pageNumber)}
					style={{ aspectRatio }}
					type="button"
				>
					<canvas
						className="absolute inset-0 h-full w-full object-contain"
						ref={canvasRef}
					/>
				</button>

				{/* Card footer: measurements badge + editable page name on the left,
				scale actions menu on the right. */}
				<div className="flex items-center justify-between gap-1 border-t bg-card px-2 py-1.5">
					<div className="flex min-w-0 flex-1 items-center gap-1">
						{hasMeasurements && (
							<Badge size="sm" title="Has measurements" variant="info">
								M
							</Badge>
						)}
						<InlineTitle
							className="min-w-0 flex-1"
							onActivate={() => onSelect(pageNumber)}
							onRename={(title) => onRenamePage(pageNumber, title)}
							value={pageTitle}
						/>
					</div>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label={`Scale for page ${pageNumber}`}
									className="size-6 shrink-0"
									size="icon-sm"
									variant="ghost"
								>
									<EllipsisVertical />
								</Button>
							}
						/>
						<MenuPopup align="end">
							<MenuGroup>
								<MenuGroupLabel>
									Scale · {overridden ? scaleLabel : `${scaleLabel} (default)`}
								</MenuGroupLabel>
								<MenuItem onClick={() => onOpenScaleDialog('page', pageNumber)}>
									<Ruler />
									Drawing scale…
								</MenuItem>
								<MenuItem onClick={() => onCalibrate('page', pageNumber)}>
									<Crosshair />
									Calibrate from line
								</MenuItem>
								{overridden && (
									<MenuItem onClick={() => onResetPage(pageNumber)}>
										<RotateCcw />
										{documentMethod
											? `Reset to default (${formatMethodLabel(documentMethod)})`
											: 'Reset to document default'}
									</MenuItem>
								)}
							</MenuGroup>
						</MenuPopup>
					</Menu>
				</div>
			</div>
		</div>
	);
}
