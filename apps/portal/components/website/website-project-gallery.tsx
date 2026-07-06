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
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useMutation, useQuery } from 'convex/react';
import {
	EllipsisVertical,
	ImageIcon,
	ImagePlus,
	PlayCircle,
	Star,
	StarOff,
	Trash2,
	X,
} from 'lucide-react';
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
						<X aria-hidden /> Cancel
					</AlertDialogClose>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* Error is handled in onDelete */
							});
						}}
						variant="destructive-outline"
					>
						<Trash2 aria-hidden /> Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ImageActionsMenu({
	project,
	mediaKey,
	isBanner,
}: {
	project: WebsiteProject;
	mediaKey: string;
	isBanner: boolean;
}) {
	const setMainImage = useMutation(
		api.websiteProjects.setMainImage.setMainImage
	);
	const addBanner = useAction(api.banners.createFromMedia.createFromMedia);
	const isMain = project.mainImageKey === mediaKey;

	const onAddBanner = async () => {
		try {
			await addBanner({ sourceKey: mediaKey });
			toastManager.add({ title: 'Added as banner', type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add this image as a banner. Please try again in a moment.'
				),
				title: 'Could not add banner',
				type: 'error',
			});
		}
	};

	const toggleMain = async () => {
		try {
			await setMainImage({
				websiteProjectId: project._id,
				key: isMain ? null : mediaKey,
			});
			toastManager.add({
				title: isMain ? 'Main image cleared' : 'Main image set',
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update the main image. Please try again in a moment.'
				),
				title: 'Could not update main image',
				type: 'error',
			});
		}
	};

	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						aria-label="Image actions"
						className="absolute end-12 top-2 shadow-md"
						size="icon"
						type="button"
						variant="outline"
					/>
				}
			>
				<EllipsisVertical />
			</MenuTrigger>
			<MenuPopup align="end">
				<MenuItem
					disabled={isBanner}
					onClick={() => {
						onAddBanner().catch(() => {
							/* Error handled in onAddBanner */
						});
					}}
				>
					<ImagePlus />
					{isBanner ? 'Already a banner' : 'Add as Banner'}
				</MenuItem>
				<MenuSeparator />
				<MenuItem
					onClick={() => {
						toggleMain().catch(() => {
							/* Error handled in toggleMain */
						});
					}}
				>
					{isMain ? <StarOff /> : <Star />}
					{isMain ? 'Unset main image' : 'Set as main image'}
				</MenuItem>
			</MenuPopup>
		</Menu>
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

	const banners = useQuery(api.banners.list.list, {});
	const bannerSourceKeys = useMemo(
		() =>
			new Set(
				(banners ?? []).map((banner) => banner.sourceKey).filter(Boolean)
			),
		[banners]
	);

	// Videos first, then the main image, then banner images, then the remaining
	// images. Original order is preserved within each group.
	const entries = useMemo<LightboxMedia[]>(() => {
		const videos: LightboxMedia[] = [];
		const mainEntries: LightboxMedia[] = [];
		const bannerEntries: LightboxMedia[] = [];
		const others: LightboxMedia[] = [];
		for (const item of media) {
			const entry: LightboxMedia = {
				key: item.key,
				type: item.type,
				url: staticCdnUrl(item.key),
			};
			if (item.type === 'video') {
				videos.push(entry);
			} else if (project.mainImageKey === item.key) {
				mainEntries.push(entry);
			} else if (bannerSourceKeys.has(item.key)) {
				bannerEntries.push(entry);
			} else {
				others.push(entry);
			}
		}
		return [...videos, ...mainEntries, ...bannerEntries, ...others];
	}, [media, project.mainImageKey, bannerSourceKeys]);

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
									className="object-cover"
									fill
									sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
									src={entry.url}
									unoptimized
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
						{entry.type === 'image' ? (
							<div className="pointer-events-none absolute start-2 top-2 flex flex-col items-start gap-1">
								{project.mainImageKey === entry.key ? (
									<span
										className="inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-white text-xs shadow-md"
										title="Main image"
									>
										<Star className="size-3 fill-current" />
										Main
									</span>
								) : null}
								{bannerSourceKeys.has(entry.key) ? (
									<span
										className="inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-white text-xs shadow-md"
										title="Added as banner"
									>
										<ImagePlus className="size-3" />
										Banner
									</span>
								) : null}
							</div>
						) : null}
						{entry.type === 'image' ? (
							<ImageActionsMenu
								isBanner={bannerSourceKeys.has(entry.key)}
								mediaKey={entry.key}
								project={project}
							/>
						) : null}
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
