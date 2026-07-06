'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardPanel } from '@workspace/ui/components/card';
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
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { Radio, RadioGroup } from '@workspace/ui/components/radio-group';
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
import {
	EllipsisVertical,
	Pencil,
	Plus,
	SearchIcon,
	Trash2,
} from 'lucide-react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { signCdnUrls } from '@/actions/cdn';
import AddInclusionVariant from '@/components/inclusions/add-inclusion-variant';
import AddVariantToProjectDialog from '@/components/inclusions/add-variant-to-project-dialog';
import DeleteInclusion from '@/components/inclusions/delete-inclusion';
import DeleteInclusionVariant from '@/components/inclusions/delete-inclusion-variant';
import EditInclusion from '@/components/inclusions/edit-inclusion';
import EditInclusionVariant from '@/components/inclusions/edit-inclusion-variant';
import {
	formatVariantBadgeLabel,
	type InclusionVariantClass,
	inclusionVariantClasses,
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

type InclusionClassFilter = 'All' | InclusionVariantClass;

function variantClassFilterCardClass(cls: InclusionClassFilter): string {
	if (cls === 'Standard') {
		return 'border-info/40 bg-info/8 dark:border-info/50 dark:bg-info/16';
	}
	if (cls === 'Gold') {
		return 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30';
	}
	if (cls === 'Platinum') {
		return 'border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950/30';
	}
	return 'border-input bg-background';
}

function CatalogueVariantImageThumbnail({
	productTitle,
	variant,
	signedImageUrl,
}: {
	productTitle: string;
	variant: Doc<'inclusionVariants'>;
	signedImageUrl: string;
}) {
	if (!signedImageUrl) {
		if (!variant.image) {
			return <span className="text-muted-foreground text-xs">No image</span>;
		}
		return <span className="text-muted-foreground text-xs">Loading…</span>;
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
					src={signedImageUrl}
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
						src={signedImageUrl}
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
	hasUnit,
}: {
	variant: Doc<'inclusionVariants'>;
	hasUnit: boolean;
}) {
	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Variant actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem disabled={!hasUnit} onClick={() => setAddOpen(true)}>
						<Plus />
						Add To Project
					</MenuItem>
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit Variant
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete Variant
					</MenuItem>
				</MenuPopup>
			</Menu>
			<AddVariantToProjectDialog
				inclusionVariantId={variant._id}
				onOpenChange={setAddOpen}
				open={addOpen}
				variantLabel={`${variant.vendor} ${variant.code}`}
			/>
			<EditInclusionVariant
				onOpenChange={setEditOpen}
				open={editOpen}
				variant={variant}
			/>
			<DeleteInclusionVariant
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				variantId={variant._id}
				variantLabel={`${variant.vendor} ${variant.code}`}
			/>
		</>
	);
}

const catalogueVariantsTableMinClass = (showPricing: boolean) =>
	showPricing ? 'min-w-[58rem]' : 'min-w-[46rem]';

function InclusionCatalogueVariantsTableInFrame({
	inclusion,
	mode,
	variants,
}: {
	inclusion: Doc<'inclusions'>;
	mode: 'builder' | 'client';
	variants: Doc<'inclusionVariants'>[];
}) {
	const showPricing = mode === 'builder';
	const minClass = catalogueVariantsTableMinClass(showPricing);
	const standardPrice = inclusion.standardPrice ?? null;
	const standardLabourPrice = inclusion.standardLabourPrice ?? null;
	const [signedImageUrls, setSignedImageUrls] = useState<
		Record<string, string>
	>({});

	useEffect(() => {
		const keys = variants
			.map((v) => v.image)
			.filter((img): img is string => Boolean(img));
		if (keys.length === 0) {
			return;
		}
		signCdnUrls(keys)
			.then(setSignedImageUrls)
			.catch(() => {
				/* images will show as loading if signing fails */
			});
	}, [variants]);
	return (
		<Frame className="w-full">
			<FramePanel className="p-0">
				<div className="w-full min-w-0 overflow-x-auto">
					<Table className={cn('w-full', minClass)}>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[11rem]">Code & Class</TableHead>
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
								} else if (standardPrice === null) {
									variationDisplay = (
										<span className="text-muted-foreground">N/A</span>
									);
								} else {
									variationDisplay = formatSignedAud(
										variant.salePrice -
											standardPrice +
											((variant.labourPrice ?? 0) - (standardLabourPrice ?? 0))
									);
								}
								return (
									<TableRow key={variant._id}>
										<TableCell className="whitespace-normal align-top leading-snug">
											<div className="flex min-w-0 flex-col gap-1.5">
												<span className="font-medium font-mono text-sm">
													{variant.code}
												</span>
												<Badge
													className="self-start"
													size="lg"
													variant={variantClassBadgeVariant(variant.class)}
												>
													{variant.class}
												</Badge>
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
													signedImageUrl={
														signedImageUrls[variant.image ?? ''] ?? ''
													}
													variant={variant}
												/>
											</div>
										</TableCell>
										<TableCell className="w-[200px] min-w-[200px] max-w-[200px] whitespace-nowrap align-middle">
											<div className="flex justify-end">
												<CatalogueVariantActionsCell
													hasUnit={!!inclusion.measurementUnit}
													variant={variant}
												/>
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
	const searchParams = useSearchParams();
	const fromCategoryId = searchParams.get('from');
	const backLink = fromCategoryId
		? `/inclusions#${fromCategoryId}`
		: '/inclusions';

	const data = useQuery(api.inclusions.get.get, { inclusionId });
	const units = useQuery(api.units.list.list, {});
	const mode = useAppModeStore((state) => state.mode);
	const [selectedClass, setSelectedClass] =
		useState<InclusionClassFilter>('All');
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const trimmedSearch = debouncedSearch.trim().toLowerCase();

	const unitAbbrById = useMemo(() => {
		const m = new Map<string, string>();
		for (const u of units ?? []) {
			m.set(u._id, u.abbr);
		}
		return m;
	}, [units]);

	const variants = data?.variants ?? [];
	const filteredVariants = useMemo(() => {
		let result = variants;
		if (selectedClass !== 'All') {
			result = result.filter((v) => v.class === selectedClass);
		}
		if (trimmedSearch) {
			result = result.filter((v) =>
				[
					v.class,
					v.code,
					v.vendor,
					v.models.join(' '),
					v.color ?? '',
					v.details ?? '',
					v.link ?? '',
				]
					.join(' ')
					.toLowerCase()
					.includes(trimmedSearch)
			);
		}
		return result;
	}, [variants, selectedClass, trimmedSearch]);

	if (data === undefined) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink={backLink} heading="Inclusion" />
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	if (data === null) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink={backLink} heading="Inclusion" />
				<p className="text-muted-foreground text-sm">Inclusion not found.</p>
			</div>
		);
	}

	const { categoryName, inclusion } = data;

	return (
		<div className={cn('flex h-full w-full flex-col gap-4')}>
			<PageHeading
				backLink={backLink}
				heading={inclusion.title}
				headingActions={
					<>
						<InputGroup className="w-48 sm:w-64">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search variants"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search variants…"
								type="search"
								value={search}
							/>
						</InputGroup>
						<Group>
							<EditInclusion
								inclusionId={inclusionId}
								initialCategoryId={inclusion.categoryId}
								initialMeasurementUnit={inclusion.measurementUnit}
								initialStandardLabourPrice={inclusion.standardLabourPrice}
								initialStandardPrice={inclusion.standardPrice}
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
							<GroupSeparator />
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
						</Group>
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
						{inclusion.standardPrice !== undefined ? (
							<Badge size="lg" variant="purple">
								{`Base ${formatAud(inclusion.standardPrice)}`}
							</Badge>
						) : (
							<Badge size="lg" variant="yellow">
								No standard price set
							</Badge>
						)}
						{inclusion.standardLabourPrice !== undefined ? (
							<Badge size="lg" variant="teal">
								{`Labour ${formatAud(inclusion.standardLabourPrice)}`}
							</Badge>
						) : null}
						{inclusion.measurementUnit &&
						unitAbbrById.get(inclusion.measurementUnit) ? (
							<Badge size="lg" variant="outline">
								{unitAbbrById.get(inclusion.measurementUnit)}
							</Badge>
						) : null}
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
				<div className="flex flex-col gap-4">
					<RadioGroup
						className="grid grid-cols-4 gap-3"
						onValueChange={(val) =>
							setSelectedClass(val as InclusionClassFilter)
						}
						value={selectedClass}
					>
						{(['All', ...inclusionVariantClasses] as const).map((cls) => (
							<label
								className="cursor-pointer"
								htmlFor={`class-filter-${cls}`}
								key={cls}
							>
								<Card
									className={cn(
										'h-full transition-colors',
										selectedClass === cls
											? variantClassFilterCardClass(cls)
											: 'border-input'
									)}
								>
									<CardPanel className="flex items-center gap-2">
										<Radio id={`class-filter-${cls}`} value={cls} />
										<span className="text-sm">{cls}</span>
									</CardPanel>
								</Card>
							</label>
						))}
					</RadioGroup>
					{filteredVariants.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							{trimmedSearch
								? 'No variants match your search.'
								: `No ${selectedClass} variants for this inclusion.`}
						</p>
					) : (
						<InclusionCatalogueVariantsTableInFrame
							inclusion={inclusion}
							mode={mode}
							variants={filteredVariants}
						/>
					)}
				</div>
			)}
		</div>
	);
}
