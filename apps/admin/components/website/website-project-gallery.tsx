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
import { ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { staticCdnUrl } from '@/lib/static-cdn';
import type { WebsiteProject } from './website-project-form-shared';
import WebsiteProjectLightbox, {
	type LightboxImage,
} from './website-project-lightbox';

interface GalleryEntry {
	imageIndex: number | null;
	key: string;
	type: 'image' | 'video';
	url: string;
}

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

	const { entries, images } = useMemo(() => {
		const imageList: LightboxImage[] = [];
		const entryList: GalleryEntry[] = media.map((item) => {
			const url = staticCdnUrl(item.key);
			if (item.type === 'image') {
				const imageIndex = imageList.length;
				imageList.push({ key: item.key, url });
				return { key: item.key, type: item.type, url, imageIndex };
			}
			return { key: item.key, type: item.type, url, imageIndex: null };
		});
		return { entries: entryList, images: imageList };
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

	const openImage = (imageIndex: number) => {
		setLightboxIndex(imageIndex);
		setLightboxOpen(true);
	};

	return (
		<>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{entries.map((entry) => (
					<div
						className="group relative aspect-square overflow-hidden rounded-lg border bg-card"
						key={entry.key}
					>
						{entry.type === 'image' && entry.imageIndex !== null ? (
							<button
								aria-label="View image"
								className="size-full cursor-zoom-in"
								onClick={() => openImage(entry.imageIndex as number)}
								type="button"
							>
								<Image
									alt={project.name}
									className="size-full object-cover"
									height={400}
									src={entry.url}
									unoptimized
									width={400}
								/>
							</button>
						) : (
							// biome-ignore lint/a11y/useMediaCaption: user-uploaded gallery videos have no captions
							<video
								className="size-full bg-black object-contain"
								controls
								src={entry.url}
							/>
						)}
						<DeleteMediaButton
							mediaKey={entry.key}
							websiteProjectId={project._id}
						/>
					</div>
				))}
			</div>

			<WebsiteProjectLightbox
				images={images}
				index={lightboxIndex}
				onIndexChange={setLightboxIndex}
				onOpenChange={setLightboxOpen}
				open={lightboxOpen}
				projectName={project.name}
			/>
		</>
	);
}
