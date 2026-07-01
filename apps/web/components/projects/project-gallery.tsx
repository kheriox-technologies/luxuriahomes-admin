'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WebProjectMedia } from '@/lib/projects';
import { staticCdnUrl } from '@/lib/static-cdn';

interface GalleryProps {
	media: WebProjectMedia[];
	projectName: string;
}

// Videos lead the gallery, then images; order within each type is preserved.
const rank = (type: WebProjectMedia['type']) => (type === 'video' ? 0 : 1);

export function ProjectGallery({ media: rawMedia, projectName }: GalleryProps) {
	const media = useMemo(
		() => [...rawMedia].sort((a, b) => rank(a.type) - rank(b.type)),
		[rawMedia]
	);
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const close = useCallback(() => setOpenIndex(null), []);
	const show = useCallback(
		(next: number) => {
			setOpenIndex((current) => {
				if (current === null) {
					return current;
				}
				const count = media.length;
				return (next + count) % count;
			});
		},
		[media.length]
	);

	useEffect(() => {
		if (openIndex === null) {
			return;
		}
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close();
			} else if (event.key === 'ArrowRight') {
				show(openIndex + 1);
			} else if (event.key === 'ArrowLeft') {
				show(openIndex - 1);
			}
		};
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKey);
		};
	}, [openIndex, show, close]);

	if (media.length === 0) {
		return null;
	}

	const active = openIndex === null ? null : media[openIndex];

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{media.map((item, index) => {
					const url = staticCdnUrl(item.key);
					return (
						<button
							aria-label={`Open ${item.type} ${index + 1} of ${media.length}`}
							className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
							key={item.key}
							onClick={() => setOpenIndex(index)}
							type="button"
						>
							{item.type === 'image' ? (
								<Image
									alt={`${projectName} — ${index + 1}`}
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
									src={url}
								/>
							) : (
								<>
									<video
										className="size-full object-cover"
										preload="metadata"
										src={`${url}#t=0.1`}
									>
										<track kind="captions" />
									</video>
									<span className="absolute inset-0 bg-brand-primary/40" />
								</>
							)}
							<span
								className={cn(
									'absolute inset-0 flex items-center justify-center',
									item.type === 'image' &&
										'bg-brand-primary/0 transition-colors group-hover:bg-brand-primary/20'
								)}
							>
								{item.type === 'video' ? (
									<span className="flex size-14 items-center justify-center rounded-full bg-brand-accent text-brand-accent-foreground shadow-lg transition-transform group-hover:scale-110">
										<Play className="size-6 translate-x-0.5 fill-current" />
									</span>
								) : null}
							</span>
						</button>
					);
				})}
			</div>

			{active ? (
				<div
					aria-label="Project media viewer"
					aria-modal="true"
					className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 sm:p-8"
					role="dialog"
				>
					<button
						aria-label="Close"
						className="absolute inset-0 cursor-default"
						onClick={close}
						type="button"
					/>
					<Button
						aria-label="Close viewer"
						className="absolute top-4 right-4 z-10 border-white/20 bg-transparent text-white hover:bg-white/10"
						onClick={close}
						size="icon-lg"
						variant="outline"
					>
						<X />
					</Button>

					{media.length > 1 ? (
						<>
							<Button
								aria-label="Previous"
								className="absolute left-3 z-10 border-white/20 bg-transparent text-white hover:bg-white/10 sm:left-6"
								onClick={() => show((openIndex ?? 0) - 1)}
								size="icon-lg"
								variant="outline"
							>
								<ChevronLeft />
							</Button>
							<Button
								aria-label="Next"
								className="absolute right-3 z-10 border-white/20 bg-transparent text-white hover:bg-white/10 sm:right-6"
								onClick={() => show((openIndex ?? 0) + 1)}
								size="icon-lg"
								variant="outline"
							>
								<ChevronRight />
							</Button>
						</>
					) : null}

					<div className="relative z-0 flex max-h-full w-full max-w-5xl items-center justify-center">
						{active.type === 'image' ? (
							<Image
								alt={`${projectName} — ${(openIndex ?? 0) + 1}`}
								className="max-h-[85vh] w-auto rounded-lg object-contain"
								height={1200}
								sizes="100vw"
								src={staticCdnUrl(active.key)}
								width={1600}
							/>
						) : (
							// biome-ignore lint/a11y/useMediaCaption: user-uploaded marketing footage has no caption track
							<video
								className="max-h-[85vh] w-auto rounded-lg"
								controls
								preload="metadata"
								src={staticCdnUrl(active.key)}
							/>
						)}
					</div>
				</div>
			) : null}
		</>
	);
}
