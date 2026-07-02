'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';

export interface LightboxMedia {
	key: string;
	type: 'image' | 'video';
	url: string;
}

export default function WebsiteProjectLightbox({
	media,
	index,
	onIndexChange,
	open,
	onOpenChange,
	projectName,
}: {
	media: LightboxMedia[];
	index: number;
	onIndexChange: (next: number) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectName: string;
}) {
	const count = media.length;

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

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goPrev();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			goNext();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			onOpenChange(false);
		}
	};

	const current = media[index];

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				className="flex w-[min(94vw,72rem)] max-w-none flex-col gap-3 overflow-hidden sm:max-w-none"
				onKeyDown={onKeyDown}
			>
				<DialogTitle className="sr-only">
					{`${projectName} ${current?.type ?? 'media'} ${index + 1} of ${count}`}
				</DialogTitle>
				<div className="relative flex max-h-[78vh] items-center justify-center overflow-hidden rounded-md bg-card">
					{current?.type === 'image' ? (
						<Image
							alt={`${projectName} ${index + 1}`}
							className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
							height={1200}
							src={current.url}
							unoptimized
							width={1600}
						/>
					) : null}

					{current?.type === 'video' ? (
						// biome-ignore lint/a11y/useMediaCaption: user-uploaded gallery videos have no captions
						<video
							autoPlay
							className="max-h-[78vh] w-auto max-w-full bg-black object-contain"
							controls
							key={current.key}
							src={current.url}
						/>
					) : null}

					{count > 1 ? (
						<>
							<Button
								aria-label="Previous"
								className="absolute top-1/2 left-2 -translate-y-1/2"
								onClick={goPrev}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronLeft />
							</Button>
							<Button
								aria-label="Next"
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
