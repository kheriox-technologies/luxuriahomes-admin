'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Frame, FramePanel } from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import type { ReactNode } from 'react';
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

function formatSignedAud(amount: number): string {
	if (amount === 0) {
		return '$0.00';
	}
	return `${amount > 0 ? '+' : '-'} ${formatAud(Math.abs(amount))}`;
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

function CatalogueVariantImageThumbnail({
	productTitle,
	variant,
}: {
	productTitle: string;
	variant: Doc<'inclusionVariants'>;
}) {
	const imageUrl = variant.image?.trim() ?? '';
	if (!imageUrl) {
		return <span className="text-muted-foreground text-xs">No image</span>;
	}
	const label = `${productTitle} ${variant.code}`;
	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						aria-label={`Open image preview for ${label}`}
						className="flex size-[75px] cursor-zoom-in items-center justify-center rounded-md border bg-card"
						type="button"
					/>
				}
			>
				<NextImage
					alt={label}
					className="size-[75px] object-contain"
					height={75}
					src={imageUrl}
					unoptimized
					width={75}
				/>
			</DialogTrigger>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>
				<div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2">
					<NextImage
						alt={label}
						className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
						height={1200}
						src={imageUrl}
						unoptimized
						width={1200}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function CatalogueVariantActionsCell({
	variant,
}: {
	variant: Doc<'inclusionVariants'>;
}) {
	return (
		<Group className="justify-end">
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
	);
}

const catalogueVariantsTableMinClass = (showPricing: boolean) =>
	showPricing ? 'min-w-[58rem]' : 'min-w-[46rem]';

function InclusionCatalogueVariantsTableInFrame({
	inclusion,
	mode,
	standardSalePrice,
	variants,
}: {
	inclusion: Doc<'inclusions'>;
	mode: 'builder' | 'client';
	standardSalePrice: number | null;
	variants: Doc<'inclusionVariants'>[];
}) {
	const showPricing = mode === 'builder';
	const minClass = catalogueVariantsTableMinClass(showPricing);
	return (
		<Frame className="w-full">
			<FramePanel className="p-0">
				<div className="w-full min-w-0 overflow-x-auto">
					<Table className={cn('w-full', minClass)}>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[11rem]">Title</TableHead>
								<TableHead className="min-w-[14rem]">
									Vendor & details
								</TableHead>
								<TableHead className="min-w-[7rem] whitespace-nowrap">
									Colour
								</TableHead>
								{showPricing ? (
									<TableHead className="whitespace-nowrap text-end">
										Cost
									</TableHead>
								) : null}
								{showPricing ? (
									<TableHead className="whitespace-nowrap text-end">
										Sale
									</TableHead>
								) : null}
								<TableHead className="min-w-[6rem] whitespace-nowrap text-end">
									Variation
								</TableHead>
								<TableHead className="w-[150px] min-w-[150px] max-w-[150px] text-end">
									Image
								</TableHead>
								<TableHead className="w-[200px] min-w-[200px] max-w-[200px] whitespace-nowrap text-end">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{variants.map((variant) => {
								const linkUrl = variant.link?.trim() ?? '';
								let variationDisplay: ReactNode;
								if (variant.class === 'Standard') {
									variationDisplay = (
										<span className="text-muted-foreground">—</span>
									);
								} else if (standardSalePrice === null) {
									variationDisplay = (
										<span className="text-muted-foreground">N/A</span>
									);
								} else {
									variationDisplay = formatSignedAud(
										variant.salePrice - standardSalePrice
									);
								}
								return (
									<TableRow key={variant._id}>
										<TableCell className="whitespace-normal align-top leading-snug">
											<div className="flex min-w-0 flex-col gap-1.5">
												<span className="font-medium">{inclusion.title}</span>
												<div className="flex flex-wrap items-center gap-2">
													<Badge
														size="lg"
														variant={variantClassBadgeVariant(variant.class)}
													>
														{variant.class}
													</Badge>
													<span className="font-mono text-muted-foreground text-xs">
														{variant.code}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="whitespace-normal align-top leading-snug">
											<div className="flex min-w-0 flex-col gap-2 text-sm">
												<p className="text-muted-foreground">
													{variant.vendor}
												</p>
												<p className="text-muted-foreground">
													{variant.models.join(', ')}
												</p>
												{variant.details ? (
													<p className="whitespace-pre-wrap text-pretty">
														{variant.details}
													</p>
												) : null}
												{linkUrl ? (
													<a
														className="text-primary text-sm underline-offset-4 hover:underline"
														href={linkUrl}
														rel="noopener noreferrer"
														target="_blank"
													>
														{linkUrl}
													</a>
												) : null}
											</div>
										</TableCell>
										<TableCell className="whitespace-normal align-top text-sm">
											{variant.color ? (
												<span className="text-muted-foreground">
													{variant.color}
												</span>
											) : (
												<span className="text-muted-foreground">—</span>
											)}
										</TableCell>
										{showPricing ? (
											<TableCell className="whitespace-normal text-end align-top tabular-nums">
												{formatAud(variant.costPrice)}
											</TableCell>
										) : null}
										{showPricing ? (
											<TableCell className="whitespace-normal text-end align-top tabular-nums">
												{formatAud(variant.salePrice)}
											</TableCell>
										) : null}
										<TableCell className="whitespace-normal text-end align-top tabular-nums">
											{variationDisplay}
										</TableCell>
										<TableCell className="w-[150px] min-w-[150px] max-w-[150px] text-end align-middle">
											<div className="flex justify-end">
												<CatalogueVariantImageThumbnail
													productTitle={inclusion.title}
													variant={variant}
												/>
											</div>
										</TableCell>
										<TableCell className="w-[200px] min-w-[200px] max-w-[200px] whitespace-nowrap align-middle">
											<div className="flex justify-end">
												<CatalogueVariantActionsCell variant={variant} />
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</FramePanel>
		</Frame>
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
				<InclusionCatalogueVariantsTableInFrame
					inclusion={inclusion}
					mode={mode}
					standardSalePrice={standardSalePrice}
					variants={variants}
				/>
			)}
		</div>
	);
}
