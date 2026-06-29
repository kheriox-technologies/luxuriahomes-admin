'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';

export interface LightboxImage {
	key: string;
	url: string;
}

export default function WebsiteProjectLightbox({
	images,
	index,
	onIndexChange,
	open,
	onOpenChange,
	projectName,
}: {
	images: LightboxImage[];
	index: number;
	onIndexChange: (next: number) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectName: string;
}) {
	const count = images.length;

	const goPrev = useCallback(() => {
		if (count > 0) {
			onIndexChange((index - 1 + count) % count);
		}
	}, [count, index, onIndexChange]);

	const goNext = useCallback(() => {
		if (count > 0) {
			onIndexChange((index + 1) % count);
		}
	}, [count, index, onIndexChange]);

	useEffect(() => {
		if (!open) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				goPrev();
			} else if (event.key === 'ArrowRight') {
				goNext();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open, goPrev, goNext]);

	const current = images[index];

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="flex w-[min(94vw,72rem)] max-w-none flex-col gap-3 sm:max-w-none">
				<DialogTitle className="sr-only">
					{`${projectName} image ${index + 1} of ${count}`}
				</DialogTitle>
				<div className="relative flex max-h-[78vh] items-center justify-center overflow-hidden rounded-md bg-card">
					{current ? (
						<Image
							alt={`${projectName} ${index + 1}`}
							className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
							height={1200}
							src={current.url}
							unoptimized
							width={1600}
						/>
					) : null}

					{count > 1 ? (
						<>
							<Button
								aria-label="Previous image"
								className="absolute top-1/2 left-2 -translate-y-1/2"
								onClick={goPrev}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronLeft />
							</Button>
							<Button
								aria-label="Next image"
								className="absolute top-1/2 right-2 -translate-y-1/2"
								onClick={goNext}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronRight />
							</Button>
						</>
					) : null}
				</div>
				{count > 1 ? (
					<p className="text-center text-muted-foreground text-sm tabular-nums">
						{index + 1} / {count}
					</p>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
