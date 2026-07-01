'use client';

import type { DragEndEvent } from '@dnd-kit/core';
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { GalleryHorizontalEnd, ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import PageHeading from '@/components/page-heading';
import { staticCdnUrl } from '@/lib/static-cdn';
import DeleteBanner from './delete-banner';

function orderValue(banner: Doc<'banners'>) {
	return banner.order ?? banner._creationTime;
}

function SortableBannerCard({ banner }: { banner: Doc<'banners'> }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: banner._id });

	return (
		<div
			className="group relative flex flex-col overflow-hidden rounded-lg border bg-card"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			<div
				className="relative aspect-video cursor-grab overflow-hidden bg-muted active:cursor-grabbing"
				{...attributes}
				{...listeners}
			>
				<Image
					alt="Banner image"
					className="object-cover"
					fill
					sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
					src={staticCdnUrl(banner.key)}
					unoptimized
				/>
			</div>
			<div className="absolute end-2 top-2">
				<DeleteBanner
					bannerId={banner._id}
					trigger={
						<Button
							aria-label="Delete banner"
							className="shadow-md"
							size="icon"
							type="button"
							variant="destructive-outline"
						>
							<Trash2 />
						</Button>
					}
				/>
			</div>
		</div>
	);
}

export default function BannersPageContent() {
	const banners = useQuery(api.banners.list.list, {});
	// Optimistically reorder the cached list on drop so the grid updates in place
	// instead of snapping back to the old order while the mutation round-trips.
	const reorder = useMutation(api.banners.reorder.reorder).withOptimisticUpdate(
		(localStore, args) => {
			const current = localStore.getQuery(api.banners.list.list, {});
			if (!current) {
				return;
			}
			const next = current
				.map((banner) =>
					banner._id === args.bannerId
						? { ...banner, order: args.order }
						: banner
				)
				.sort((a, b) => orderValue(a) - orderValue(b));
			localStore.setQuery(api.banners.list.list, {}, next);
		}
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!(banners && over) || active.id === over.id) {
			return;
		}
		const oldIndex = banners.findIndex((b) => b._id === active.id);
		const newIndex = banners.findIndex((b) => b._id === over.id);
		if (oldIndex === -1 || newIndex === -1) {
			return;
		}

		const reordered = arrayMove(banners, oldIndex, newIndex);
		const position = reordered.findIndex((b) => b._id === active.id);
		const prev = reordered[position - 1];
		const next = reordered[position + 1];

		let newOrder: number;
		if (prev && next) {
			newOrder = (orderValue(prev) + orderValue(next)) / 2;
		} else if (prev) {
			newOrder = orderValue(prev) + 1;
		} else if (next) {
			newOrder = orderValue(next) - 1;
		} else {
			newOrder = 1;
		}

		reorder({
			bannerId: active.id as Doc<'banners'>['_id'],
			order: newOrder,
		}).catch(() => {
			/* Convex surfaces errors; the grid stays reactive */
		});
	};

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col gap-4')}>
			<PageHeading
				description="Hero images shown on the marketing website. Add banners from a project's images, then drag to reorder."
				heading="Banners"
				icon={GalleryHorizontalEnd}
			/>

			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
				{banners === undefined ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="aspect-video w-full rounded-lg" />
						<Skeleton className="aspect-video w-full rounded-lg" />
						<Skeleton className="aspect-video w-full rounded-lg" />
					</div>
				) : null}
				{banners?.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ImageIcon aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No banners yet</EmptyTitle>
							<EmptyDescription>
								Open a website project, then use the menu on an image and choose
								“Add as Banner”.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : null}
				{banners && banners.length > 0 ? (
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={onDragEnd}
						sensors={sensors}
					>
						<SortableContext
							items={banners.map((b) => b._id)}
							strategy={rectSortingStrategy}
						>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{banners.map((banner) => (
									<SortableBannerCard banner={banner} key={banner._id} />
								))}
							</div>
						</SortableContext>
					</DndContext>
				) : null}
			</div>
		</div>
	);
}
