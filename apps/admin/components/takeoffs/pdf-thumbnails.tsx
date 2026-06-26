'use client';

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@workspace/ui/components/alert';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import { Copy, EllipsisVertical, ListPlus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
	numPages: number;
	onAddToMeasurements: (page: number) => void;
	onCopyPage: (page: number) => Promise<void>;
	onDeletePage: (page: number) => Promise<void>;
	onRenamePage: (page: number, title: string) => void;
	onSelectPage: (page: number) => void;
	/** Pages already in the measurements panel; disables their "Add to Measurements". */
	pagesInMeasurements: Set<number>;
	pagesWithMeasurements: Set<number>;
	pageTitles: Record<number, string>;
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
	onAddToMeasurements,
	onCopyPage,
	onDeletePage,
	onRenamePage,
	onSelectPage,
	pagesInMeasurements,
	pagesWithMeasurements,
	pageTitles,
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
							inMeasurements={pagesInMeasurements.has(pageNumber)}
							key={pageNumber}
							numPages={numPages}
							onAddToMeasurements={onAddToMeasurements}
							onCopyPage={onCopyPage}
							onDeletePage={onDeletePage}
							onRenamePage={onRenamePage}
							onSelect={onSelectPage}
							pageNumber={pageNumber}
							pageTitle={pageTitles[pageNumber] ?? `Page ${pageNumber}`}
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
	inMeasurements,
	numPages,
	onAddToMeasurements,
	onCopyPage,
	onDeletePage,
	onRenamePage,
	onSelect,
	pageTitle,
	renderThumbnail,
	ready,
	scrollRoot,
}: {
	pageNumber: number;
	active: boolean;
	hasMeasurements: boolean;
	inMeasurements: boolean;
	numPages: number;
	onAddToMeasurements: (page: number) => void;
	onCopyPage: (page: number) => Promise<void>;
	onDeletePage: (page: number) => Promise<void>;
	onRenamePage: (page: number, title: string) => void;
	onSelect: (page: number) => void;
	pageTitle: string;
	renderThumbnail: PdfThumbnailsProps['renderThumbnail'];
	ready: boolean;
	scrollRoot: React.RefObject<HTMLDivElement | null>;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	// height / width of the rendered page; null until the thumbnail renders.
	const [aspect, setAspect] = useState<number | null>(null);
	const [visible, setVisible] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	// Snapshot of whether the page had measurements when the confirm dialog was
	// opened. Using the live `hasMeasurements` would flip mid-delete, because
	// deleting a page shifts the next page's measurements onto this page number.
	const [confirmHadMeasurements, setConfirmHadMeasurements] = useState(false);

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

	const confirmDelete = () => {
		setDeleting(true);
		onDeletePage(pageNumber)
			.then(() => setConfirmDeleteOpen(false))
			.catch(() => undefined)
			.finally(() => setDeleting(false));
	};

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
				actions menu on the right. */}
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
									aria-label={`Actions for page ${pageNumber}`}
									className="size-6 shrink-0"
									size="icon-sm"
									variant="ghost"
								>
									<EllipsisVertical />
								</Button>
							}
						/>
						<MenuPopup align="end">
							<MenuItem
								onClick={() => {
									onCopyPage(pageNumber).catch(() => undefined);
								}}
							>
								<Copy />
								Copy Page
							</MenuItem>
							<MenuItem
								disabled={inMeasurements}
								onClick={() => onAddToMeasurements(pageNumber)}
							>
								<ListPlus />
								Add to Measurements
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								disabled={numPages <= 1}
								onClick={() => {
									setConfirmHadMeasurements(hasMeasurements);
									setConfirmDeleteOpen(true);
								}}
								variant="destructive"
							>
								<Trash2 />
								Delete Page
							</MenuItem>
						</MenuPopup>
					</Menu>
				</div>
			</div>

			<AlertDialog onOpenChange={setConfirmDeleteOpen} open={confirmDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{`Delete page ${pageNumber}?`}</AlertDialogTitle>
						<AlertDialogDescription>
							This removes the page from the PDF. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					{confirmHadMeasurements && (
						<Alert className="mx-6 mb-2 w-auto" variant="warning">
							<AlertTitle>This page has measurements</AlertTitle>
							<AlertDescription>
								Deleting this page will also delete all measurements on it from
								the take-off.
							</AlertDescription>
						</Alert>
					)}
					<AlertDialogFooter>
						<AlertDialogClose
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<Button
							loading={deleting}
							onClick={confirmDelete}
							type="button"
							variant="destructive"
						>
							Delete page
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
