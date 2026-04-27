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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import AddInclusionVariant from '@/components/inclusions/add-inclusion-variant';
import AddVariantToProjectDialog from '@/components/inclusions/add-variant-to-project-dialog';
import DeleteInclusion from '@/components/inclusions/delete-inclusion';
import DeleteInclusionVariant from '@/components/inclusions/delete-inclusion-variant';
import EditInclusion from '@/components/inclusions/edit-inclusion';
import EditInclusionVariant from '@/components/inclusions/edit-inclusion-variant';
import {
	formatVariantBadgeLabel,
	type InclusionVariantClass,
} from '@/components/inclusions/inclusion-form-shared';
import PageHeading from '@/components/page-heading';
import { useAppModeStore } from '@/stores/app-mode-store';

const audFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

function formatAud(amount: number): string {
	return audFormatter.format(amount);
}

function variantClassBadgeVariant(
	className: InclusionVariantClass
): 'outline' | 'info' | 'yellow' | 'purple' {
	if (className === 'Standard') {
		return 'info';
	}
	if (className === 'Gold') {
		return 'yellow';
	}
	if (className === 'Platinum') {
		return 'purple';
	}
	return 'outline';
}

function InclusionVariantCard({
	variant,
	standardSalePrice,
	mode,
}: {
	variant: Doc<'inclusionVariants'>;
	standardSalePrice: number | null;
	mode: 'builder' | 'client';
}) {
	const imageUrl = variant.image?.trim() ?? '';
	const linkUrl = variant.link?.trim() ?? '';
	const variationAmount =
		standardSalePrice === null ? null : variant.salePrice - standardSalePrice;
	let variationLabel = 'N/A';
	if (variationAmount === 0) {
		variationLabel = '$0.00';
	} else if (variationAmount !== null) {
		variationLabel = `${variationAmount > 0 ? '+' : '-'} ${formatAud(
			Math.abs(variationAmount)
		)}`;
	}

	return (
		<CardFrame className="h-full">
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
					<Group>
						<AddVariantToProjectDialog
							inclusionVariantId={variant._id}
							trigger={
								<Button type="button" variant="outline">
									Add To Project
								</Button>
							}
							variantLabel={`${variant.vendor} ${variant.code}`}
						/>
						<GroupSeparator />
						<EditInclusionVariant
							trigger={
								<Button
									aria-label="Edit variant"
									size="icon"
									type="button"
									variant="outline"
								>
									<Pencil />
								</Button>
							}
							variant={variant}
						/>
						<GroupSeparator />
						<DeleteInclusionVariant
							trigger={
								<Button
									aria-label="Delete variant"
									size="icon"
									type="button"
									variant="destructive-outline"
								>
									<Trash2 />
								</Button>
							}
							variantId={variant._id}
							variantLabel={`${variant.vendor} ${variant.code}`}
						/>
					</Group>
				</CardFrameAction>
			</CardFrameHeader>
			<Card className="flex h-full flex-row items-stretch overflow-hidden">
				<CardPanel className="flex h-full min-w-0 flex-1 flex-col space-y-2 text-sm">
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
					<div className="flex flex-wrap items-center gap-2 pt-1">
						{mode === 'builder' ? (
							<>
								<Badge className="shrink-0" size="lg" variant="warning">
									Cost {formatAud(variant.costPrice)}
								</Badge>
								<Badge className="shrink-0" size="lg" variant="success">
									Sale {formatAud(variant.salePrice)}
								</Badge>
							</>
						) : null}
						{variant.class !== 'Standard' ? (
							<Badge className="shrink-0" size="lg" variant="purple">
								{variationLabel}
							</Badge>
						) : null}
					</div>
				</CardPanel>
				{imageUrl ? (
					<div className="flex shrink-0 items-center py-5 pr-5 pl-3">
						<Dialog>
							<DialogTrigger
								render={
									<button
										aria-label={`Open image preview for ${variant.vendor} ${variant.code}`}
										className="flex h-[150px] w-[150px] cursor-zoom-in items-center justify-center bg-card"
										type="button"
									/>
								}
							>
								<NextImage
									alt={`${variant.vendor} ${variant.code}`}
									className="h-[150px] max-h-[150px] w-auto max-w-[150px] object-contain"
									height={150}
									src={imageUrl}
									unoptimized
									width={150}
								/>
							</DialogTrigger>
							<DialogContent className="sm:max-w-3xl">
								<DialogHeader>
									<DialogTitle>{`${variant.vendor} ${variant.code}`}</DialogTitle>
								</DialogHeader>
								<div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2">
									<NextImage
										alt={`${variant.vendor} ${variant.code}`}
										className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
										height={1200}
										src={imageUrl}
										unoptimized
										width={1200}
									/>
								</div>
							</DialogContent>
						</Dialog>
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
	const mode = useAppModeStore((state) => state.mode);

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
	const standardSalePrice =
		variants.find((variant) => variant.class === 'Standard')?.salePrice ?? null;

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
						<InclusionVariantCard
							key={variant._id}
							mode={mode}
							standardSalePrice={standardSalePrice}
							variant={variant}
						/>
					))}
				</div>
			)}
		</div>
	);
}
