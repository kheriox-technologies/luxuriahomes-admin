'use client';

import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { usePdfDocument } from '@/components/takeoffs/use-pdf-document';

const PREVIEW_RENDER_WIDTH = 820;

/**
 * Rasterised preview of a locally generated PDF blob URL, used by the composer
 * screens that build a document in the browser.
 */
export default function PdfBlobPreview({
	error,
	loading,
	title = 'Preview',
	url,
}: {
	error?: string | null;
	loading?: boolean;
	title?: string;
	url: string | null;
}) {
	return (
		<div className="flex min-h-0 flex-col rounded-lg border bg-muted/30">
			<div className="flex items-center justify-between border-b px-4 py-2">
				<span className="font-medium text-sm">{title}</span>
				{loading ? (
					<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<Loader2 className="size-3.5 animate-spin" /> Updating…
					</span>
				) : null}
			</div>
			<div className="min-h-0 flex-1">{renderBody(error ?? null, url)}</div>
		</div>
	);
}

function renderBody(error: string | null, url: string | null) {
	if (error) {
		return <div className="p-4 text-destructive text-sm">{error}</div>;
	}
	if (!url) {
		return (
			<div className="p-4 text-muted-foreground text-sm">
				Preview will appear here.
			</div>
		);
	}
	return <PdfCanvasStack url={url} />;
}

function PdfCanvasStack({ url }: { url: string }) {
	const { numPages, renderThumbnail, ready, error } = usePdfDocument(url);
	const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

	useEffect(() => {
		if (!ready || numPages === 0) {
			return;
		}
		let cancelled = false;
		(async () => {
			for (let page = 1; page <= numPages; page++) {
				if (cancelled) {
					return;
				}
				const canvas = canvasRefs.current.get(page);
				if (canvas) {
					await renderThumbnail(page, canvas, PREVIEW_RENDER_WIDTH);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ready, numPages, renderThumbnail]);

	if (error) {
		return <div className="p-4 text-destructive text-sm">{error}</div>;
	}

	return (
		<ScrollArea className="h-full">
			<div className="flex flex-col items-center gap-4 p-4">
				{Array.from(
					{ length: Math.max(numPages, 1) },
					(_, index) => index + 1
				).map((page) => (
					<canvas
						className="h-auto w-full max-w-[820px] rounded-sm border bg-white shadow-sm"
						key={page}
						ref={(element) => {
							if (element) {
								canvasRefs.current.set(page, element);
							} else {
								canvasRefs.current.delete(page);
							}
						}}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
