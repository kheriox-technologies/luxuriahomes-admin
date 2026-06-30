'use client';

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
import { useQuery } from 'convex/react';
import { GalleryHorizontalEnd, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import PageHeading from '@/components/page-heading';
import { staticCdnUrl } from '@/lib/static-cdn';
import DeleteBanner from './delete-banner';
import EditBanner from './edit-banner';

function BannerCard({ banner }: { banner: Doc<'banners'> }) {
	const [editOpen, setEditOpen] = useState(false);

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card">
			<div className="relative aspect-video overflow-hidden bg-muted">
				<Image
					alt={banner.title}
					className="object-cover"
					fill
					sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
					src={staticCdnUrl(banner.key)}
					unoptimized
				/>
				<div className="absolute end-2 top-2 flex gap-2">
					<Button
						aria-label="Edit banner"
						className="shadow-md"
						onClick={() => setEditOpen(true)}
						size="icon"
						type="button"
						variant="outline"
					>
						<Pencil />
					</Button>
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
			<div className="space-y-1 p-3">
				<p className="truncate font-medium text-sm">{banner.title}</p>
				{banner.description ? (
					<p className="line-clamp-2 text-muted-foreground text-xs">
						{banner.description}
					</p>
				) : null}
			</div>
			<EditBanner banner={banner} onOpenChange={setEditOpen} open={editOpen} />
		</div>
	);
}

export default function BannersPageContent() {
	const banners = useQuery(api.banners.list.list, {});

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col gap-4')}>
			<PageHeading
				description="Hero images shown on the marketing website. Add banners from a project's images."
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
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{banners.map((banner) => (
							<BannerCard banner={banner} key={banner._id} />
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}
