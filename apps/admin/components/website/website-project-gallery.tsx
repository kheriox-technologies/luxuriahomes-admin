'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { ImageIcon, PlayCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { staticCdnUrl } from '@/lib/static-cdn';
import type { WebsiteProject } from './website-project-form-shared';
import WebsiteProjectLightbox, {
	type LightboxMedia,
} from './website-project-lightbox';

function DeleteMediaButton({
	websiteProjectId,
	mediaKey,
}: {
	websiteProjectId: Id<'websiteProjects'>;
	mediaKey: string;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const deleteMedia = useAction(api.websiteProjects.deleteMedia.deleteMedia);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteMedia({ websiteProjectId, key: mediaKey });
			toastManager.add({ title: 'Media deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete media. Please try again in a moment.'
				),
				title: 'Could not delete media',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger
				render={
					<Button
						aria-label="Delete media"
						className="absolute end-2 top-2 shadow-md"
						size="icon"
						type="button"
						variant="destructive-outline"
					/>
				}
			>
				<Trash2 />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete media?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete this file from the public bucket. This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* Error is handled in onDelete */
							});
						}}
						variant="destructive"
					>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function WebsiteProjectGallery({
	project,
}: {
	project: WebsiteProject;
}) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const media = useMemo(() => project.media ?? [], [project.media]);

	// Videos first, then images, preserving original order within each group.
	const entries = useMemo<LightboxMedia[]>(() => {
		const videos: LightboxMedia[] = [];
		const images: LightboxMedia[] = [];
		for (const item of media) {
			const entry: LightboxMedia = {
				key: item.key,
				type: item.type,
				url: staticCdnUrl(item.key),
			};
			if (item.type === 'video') {
				videos.push(entry);
			} else {
				images.push(entry);
			}
		}
		return [...videos, ...images];
	}, [media]);

	if (entries.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ImageIcon aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No media yet</EmptyTitle>
					<EmptyDescription>
						Use the Upload Images / Videos button to add photos and videos for
						this project.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	const openMedia = (index: number) => {
		setLightboxIndex(index);
		setLightboxOpen(true);
	};

	return (
		<>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{entries.map((entry, index) => (
					<div
						className="group relative aspect-square overflow-hidden rounded-lg border bg-card"
						key={entry.key}
					>
						<button
							aria-label={entry.type === 'video' ? 'Play video' : 'View image'}
							className="relative size-full cursor-zoom-in"
							onClick={() => openMedia(index)}
							type="button"
						>
							{entry.type === 'image' ? (
								<Image
									alt={project.name}
									className="size-full object-cover"
									height={400}
									src={entry.url}
									unoptimized
									width={400}
								/>
							) : (
								<>
									<video
										className="size-full bg-black object-cover"
										muted
										preload="metadata"
										src={entry.url}
									/>
									<span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
										<PlayCircle className="size-12 text-white drop-shadow-md" />
									</span>
								</>
							)}
						</button>
						<DeleteMediaButton
							mediaKey={entry.key}
							websiteProjectId={project._id}
						/>
					</div>
				))}
			</div>

			<WebsiteProjectLightbox
				index={lightboxIndex}
				media={entries}
				onIndexChange={setLightboxIndex}
				onOpenChange={setLightboxOpen}
				open={lightboxOpen}
				projectName={project.name}
			/>
		</>
	);
}
