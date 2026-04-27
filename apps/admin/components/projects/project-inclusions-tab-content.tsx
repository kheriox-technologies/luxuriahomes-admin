'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardFrame,
	CardFrameAction,
	CardFrameDescription,
	CardFrameHeader,
	CardFrameTitle,
	CardHeader,
	CardPanel,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Download, SearchIcon, Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { useAppModeStore } from '@/stores/app-mode-store';

type ProjectInclusion = Doc<'projectInclusions'>;
type InclusionCategory = Doc<'inclusionCategories'>;

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
	className: ProjectInclusion['class']
): 'outline' | 'teal' | 'yellow' | 'purple' {
	if (className === 'Standard') {
		return 'teal';
	}
	if (className === 'Gold') {
		return 'yellow';
	}
	if (className === 'Platinum') {
		return 'purple';
	}
	return 'outline';
}

function DeleteProjectInclusionButton({
	projectInclusionId,
	title,
	code,
}: {
	projectInclusionId: Id<'projectInclusions'>;
	title: string;
	code: string;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeProjectInclusion = useMutation(
		api.projectInclusions.remove.remove
	);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeProjectInclusion({ projectInclusionId });
			toastManager.add({
				title: 'Inclusion deleted',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete inclusion. Please try again in a moment.'
				),
				title: 'Could not delete inclusion',
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
						aria-label={`Delete inclusion ${title} ${code}`}
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
					<AlertDialogTitle>Delete inclusion?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${title} (${code}) from this project.`}
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
						type="button"
						variant="destructive"
					>
						Delete inclusion
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ProjectInclusionCard({
	inclusion,
	mode,
}: {
	inclusion: ProjectInclusion;
	mode: 'builder' | 'client';
}) {
	const imageUrl = inclusion.image?.trim() ?? '';

	return (
		<Card className="flex flex-row items-stretch overflow-hidden">
			<div className="min-w-0 flex-1">
				<CardHeader className="gap-y-2">
					<CardTitle className="flex min-w-0 flex-wrap items-center gap-2 leading-snug">
						<span className="min-w-0">{inclusion.title}</span>
						<Badge
							size="lg"
							variant={variantClassBadgeVariant(inclusion.class)}
						>
							{inclusion.class}
						</Badge>
						<span className="font-mono text-muted-foreground text-xs">
							{inclusion.code}
						</span>
					</CardTitle>
					<CardAction className="absolute top-3 right-3">
						<DeleteProjectInclusionButton
							code={inclusion.code}
							projectInclusionId={inclusion._id}
							title={inclusion.title}
						/>
					</CardAction>
				</CardHeader>
				<CardPanel className="space-y-2 text-sm">
					<p className="text-muted-foreground">{`${inclusion.vendor} - ${inclusion.models.join(', ')}`}</p>
					{inclusion.details ? (
						<p className="whitespace-pre-wrap text-pretty">
							{inclusion.details}
						</p>
					) : null}
					<div className="flex flex-wrap items-center gap-2 pt-1">
						{mode === 'builder' ? (
							<>
								<Badge className="shrink-0" size="lg" variant="warning">
									Cost {formatAud(inclusion.costPrice)}
								</Badge>
								<Badge className="shrink-0" size="lg" variant="success">
									Sale {formatAud(inclusion.salePrice)}
								</Badge>
							</>
						) : null}
						{inclusion.class !== 'Standard' &&
						inclusion.variationSalePrice !== undefined ? (
							<Badge className="shrink-0" size="lg" variant="purple">
								{formatSignedAud(inclusion.variationSalePrice)}
							</Badge>
						) : null}
					</div>
				</CardPanel>
			</div>
			{imageUrl ? (
				<div className="flex shrink-0 items-center py-5 pr-14 pl-3">
					<Dialog>
						<DialogTrigger
							render={
								<button
									aria-label={`Open image preview for ${inclusion.title} ${inclusion.code}`}
									className="flex h-[150px] w-[150px] cursor-zoom-in items-center justify-center bg-card"
									type="button"
								/>
							}
						>
							<NextImage
								alt={`${inclusion.title} ${inclusion.code}`}
								className="h-[150px] max-h-[150px] w-auto max-w-[150px] object-contain"
								height={150}
								src={imageUrl}
								unoptimized
								width={150}
							/>
						</DialogTrigger>
						<DialogContent className="sm:max-w-3xl">
							<DialogHeader>
								<DialogTitle>{`${inclusion.title} ${inclusion.code}`}</DialogTitle>
							</DialogHeader>
							<div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2">
								<NextImage
									alt={`${inclusion.title} ${inclusion.code}`}
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
	);
}

interface InclusionSection {
	categoryId: InclusionCategory['_id'];
	categoryName: string;
	inclusions: ProjectInclusion[];
	totalVariationSalePrice: number;
}

export default function ProjectInclusionsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const inclusions = useQuery(api.projectInclusions.list.list, { projectId });
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const mode = useAppModeStore((state) => state.mode);

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const trimmedSearch = debouncedSearch.trim();
	const variantSearchResults = useQuery(
		api.inclusionVariants.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);

	const categoryById = useMemo(() => {
		const map = new Map<InclusionCategory['_id'], string>();
		if (!categories) {
			return map;
		}
		for (const category of categories) {
			map.set(category._id, category.name);
		}
		return map;
	}, [categories]);

	const sections = useMemo((): InclusionSection[] => {
		if (!inclusions) {
			return [];
		}
		const grouped = new Map<InclusionCategory['_id'], ProjectInclusion[]>();
		for (const inclusion of inclusions) {
			const existing = grouped.get(inclusion.categoryId) ?? [];
			existing.push(inclusion);
			grouped.set(inclusion.categoryId, existing);
		}
		return [...grouped.entries()]
			.map(([categoryId, groupedInclusions]) => ({
				categoryId,
				categoryName: categoryById.get(categoryId) ?? 'Unknown category',
				inclusions: [...groupedInclusions].sort((a, b) =>
					a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
				),
				totalVariationSalePrice: groupedInclusions.reduce(
					(total, inclusion) =>
						total +
						(inclusion.class === 'Standard'
							? 0
							: (inclusion.variationSalePrice ?? 0)),
					0
				),
			}))
			.sort((a, b) =>
				a.categoryName.localeCompare(b.categoryName, undefined, {
					sensitivity: 'base',
				})
			);
	}, [inclusions, categoryById]);

	const visibleSections = useMemo(() => {
		if (trimmedSearch === '') {
			return { loading: false as const, list: sections };
		}
		if (variantSearchResults === undefined) {
			return { loading: true as const, list: null };
		}
		const codes = new Set(variantSearchResults.map((v) => v.code));
		const list = sections
			.map((section) => {
				const filteredInclusions = section.inclusions.filter((inclusion) =>
					codes.has(inclusion.code)
				);
				const totalVariationSalePrice = filteredInclusions.reduce(
					(total, inclusion) =>
						total +
						(inclusion.class === 'Standard'
							? 0
							: (inclusion.variationSalePrice ?? 0)),
					0
				);
				return {
					...section,
					inclusions: filteredInclusions,
					totalVariationSalePrice,
				};
			})
			.filter((section) => section.inclusions.length > 0);
		return { loading: false as const, list };
	}, [trimmedSearch, variantSearchResults, sections]);

	if (inclusions === undefined || categories === undefined) {
		return <p className="text-muted-foreground text-sm">Loading inclusions…</p>;
	}

	const toolbar = (
		<div className="flex min-w-0 flex-row items-center gap-2">
			<InputGroup className="min-w-0 flex-1">
				<InputGroupAddon align="inline-start">
					<InputGroupText>
						<SearchIcon aria-hidden />
					</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput
					aria-label="Search inclusions by product variant"
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search product variants (vendor, models, code…)"
					type="search"
					value={search}
				/>
			</InputGroup>
			<Button
				aria-label="Download project inclusions"
				className="shrink-0"
				type="button"
				variant="outline"
			>
				<Download aria-hidden />
				Download
			</Button>
		</div>
	);

	if (inclusions.length === 0) {
		return (
			<div className={cn('flex flex-col gap-4')}>
				{toolbar}
				<p className="text-muted-foreground text-sm">
					No inclusions added to this project yet.
				</p>
			</div>
		);
	}

	let listBody: ReactNode;
	if (visibleSections.loading) {
		listBody = (
			<p className="text-muted-foreground text-sm">
				Searching product variants…
			</p>
		);
	} else if (
		trimmedSearch !== '' &&
		visibleSections.list !== null &&
		visibleSections.list.length === 0
	) {
		listBody = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<SearchIcon aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching inclusions</EmptyTitle>
					<EmptyDescription>
						No project inclusions match the catalogue variants for this search.
						Try another code, vendor, or model.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		const frames = visibleSections.list ?? sections;
		listBody = (
			<div className={cn('flex flex-col gap-4')}>
				{frames.map((section) => (
					<CardFrame key={section.categoryId}>
						<CardFrameHeader>
							<CardFrameTitle>{section.categoryName}</CardFrameTitle>
							<CardFrameAction>
								<Badge
									className="shrink-0 self-center"
									size="lg"
									variant="purple"
								>
									{formatSignedAud(section.totalVariationSalePrice)}
								</Badge>
							</CardFrameAction>
							<CardFrameDescription>
								{section.inclusions.length}{' '}
								{section.inclusions.length === 1 ? 'inclusion' : 'inclusions'}
							</CardFrameDescription>
						</CardFrameHeader>
						{section.inclusions.map((inclusion) => (
							<ProjectInclusionCard
								inclusion={inclusion}
								key={inclusion._id}
								mode={mode}
							/>
						))}
					</CardFrame>
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex flex-col gap-4')}>
			{toolbar}
			{listBody}
		</div>
	);
}
