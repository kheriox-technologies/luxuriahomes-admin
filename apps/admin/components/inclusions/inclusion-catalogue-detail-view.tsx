'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardFrame,
	CardFrameAction,
	CardFrameHeader,
	CardFrameTitle,
	CardPanel,
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import AddInclusionVariant from '@/components/inclusions/add-inclusion-variant';
import DeleteInclusion from '@/components/inclusions/delete-inclusion';
import EditInclusion from '@/components/inclusions/edit-inclusion';
import {
	formatVariantBadgeLabel,
	type InclusionVariantClass,
} from '@/components/inclusions/inclusion-form-shared';
import PageHeading from '@/components/page-heading';

const audFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

function formatAud(amount: number): string {
	return audFormatter.format(amount);
}

function variantClassBadgeVariant(
	className: InclusionVariantClass
): 'outline' | 'warning' | 'secondary' {
	if (className === 'Gold') {
		return 'warning';
	}
	if (className === 'Platinum') {
		return 'secondary';
	}
	return 'outline';
}

function InclusionVariantCard({
	variant,
}: {
	variant: Doc<'inclusionVariants'>;
}) {
	const imageUrl = variant.image?.trim() ?? '';
	const linkUrl = variant.link?.trim() ?? '';

	return (
		<CardFrame>
			<CardFrameHeader className="flex flex-row items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<CardFrameTitle className="min-w-0 truncate leading-snug">
						{variant.vendor}
					</CardFrameTitle>
					<div className="mt-1.5 flex flex-wrap items-center gap-2">
						<Badge size="lg" variant={variantClassBadgeVariant(variant.class)}>
							{variant.class}
						</Badge>
						<span className="font-mono text-muted-foreground text-xs">
							{variant.code}
						</span>
					</div>
				</div>
				<CardFrameAction>
					<div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
						<Badge className="shrink-0" size="lg" variant="outline">
							Cost {formatAud(variant.costPrice)}
						</Badge>
						<Badge className="shrink-0" size="lg" variant="info">
							Sale {formatAud(variant.salePrice)}
						</Badge>
					</div>
				</CardFrameAction>
			</CardFrameHeader>
			<Card className="flex flex-row items-start overflow-hidden">
				<CardPanel className="min-w-0 flex-1 space-y-2 text-sm">
					<dl className="space-y-2">
						<div>
							<dt className="text-muted-foreground text-xs tracking-wide">
								Models
							</dt>
							<dd>{variant.models.join(', ')}</dd>
						</div>
						{variant.color ? (
							<div>
								<dt className="text-muted-foreground text-xs tracking-wide">
									Colour
								</dt>
								<dd>{variant.color}</dd>
							</div>
						) : null}
						{variant.details ? (
							<div>
								<dt className="text-muted-foreground text-xs tracking-wide">
									Details
								</dt>
								<dd className="whitespace-pre-wrap text-pretty">
									{variant.details}
								</dd>
							</div>
						) : null}
						{linkUrl ? (
							<div>
								<dt className="text-muted-foreground text-xs tracking-wide">
									Link
								</dt>
								<dd>
									<a
										className="text-primary underline-offset-4 hover:underline"
										href={linkUrl}
										rel="noopener noreferrer"
										target="_blank"
									>
										{linkUrl}
									</a>
								</dd>
							</div>
						) : null}
					</dl>
				</CardPanel>
				{imageUrl ? (
					<div className="flex shrink-0 items-center py-5 pr-5 pl-3">
						<div className="relative h-[150px] w-[150px] bg-muted">
							<NextImage
								alt=""
								className="object-cover"
								fill
								sizes="150px"
								src={imageUrl}
								unoptimized
							/>
						</div>
					</div>
				) : null}
			</Card>
		</CardFrame>
	);
}

export default function InclusionCatalogueDetailView({
	inclusionId,
}: {
	inclusionId: Id<'inclusions'>;
}) {
	const data = useQuery(api.inclusions.get.get, { inclusionId });

	if (data === undefined) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/inclusions/catalogue" heading="Inclusion" />
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	if (data === null) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/inclusions/catalogue" heading="Inclusion" />
				<p className="text-muted-foreground text-sm">Inclusion not found.</p>
			</div>
		);
	}

	const { categoryName, inclusion, variants } = data;

	return (
		<div className={cn('flex h-full w-full flex-col gap-6')}>
			<PageHeading
				backLink="/inclusions/catalogue"
				className="mb-0"
				heading={inclusion.title}
				headingActions={
					<>
						<EditInclusion
							inclusionId={inclusionId}
							initialCategoryId={inclusion.categoryId}
							initialTitle={inclusion.title}
							trigger={
								<Button
									aria-label="Edit inclusion"
									size="icon"
									type="button"
									variant="outline"
								>
									<Pencil />
								</Button>
							}
						/>
						<DeleteInclusion
							inclusionId={inclusionId}
							inclusionTitle={inclusion.title}
							redirectToCatalogueAfterDelete
							trigger={
								<Button
									aria-label="Delete inclusion"
									size="icon"
									type="button"
									variant="destructive-outline"
								>
									<Trash2 />
								</Button>
							}
						/>
					</>
				}
				metaSlot={
					<>
						<Badge size="lg" variant="outline">
							{categoryName}
						</Badge>
						<Badge size="lg" variant="info">
							{formatVariantBadgeLabel(inclusion.variantCount)}
						</Badge>
					</>
				}
				rightSlot={
					<AddInclusionVariant
						inclusionId={inclusionId}
						trigger={<Button variant="default">Add Variant</Button>}
					/>
				}
			/>
			{variants.length === 0 ? (
				<p className="text-muted-foreground text-sm">
					No variants yet. Use Add Variant to create one.
				</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{variants.map((variant) => (
						<InclusionVariantCard key={variant._id} variant={variant} />
					))}
				</div>
			)}
		</div>
	);
}
