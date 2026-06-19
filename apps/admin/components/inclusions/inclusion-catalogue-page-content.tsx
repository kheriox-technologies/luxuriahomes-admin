'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Frame, FrameHeader, FrameTitle } from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import {
	Pencil,
	Plus,
	SearchIcon,
	SquaresIntersect,
	Trash2,
} from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AddInclusion from '@/components/inclusions/add-inclusion';
import DeleteInclusion from '@/components/inclusions/delete-inclusion';
import EditInclusion from '@/components/inclusions/edit-inclusion';
import EditInclusionCategory from '@/components/inclusions/edit-inclusion-category';
import { formatVariantBadgeLabel } from '@/components/inclusions/inclusion-form-shared';
import PageHeading from '@/components/page-heading';

type Inclusion = Doc<'inclusions'>;
type InclusionCategory = Doc<'inclusionCategories'>;

const audFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

function inclusionCountBadgeLabel(count: number): string {
	const noun = count === 1 ? 'Inclusion' : 'Inclusions';
	return `${count} ${noun}`;
}

function InclusionRow({
	inclusion,
	categoryId,
}: {
	inclusion: Inclusion;
	categoryId: Id<'inclusionCategories'>;
}) {
	return (
		<TableRow>
			<TableCell className="min-w-0">
				<Link
					className="font-medium text-foreground no-underline hover:underline"
					href={
						`/inclusions/${inclusion._id}?from=${categoryId}` as LinkProps<string>['href']
					}
				>
					<span className="block truncate">{inclusion.title}</span>
				</Link>
			</TableCell>
			<TableCell>
				<Badge size="lg" variant="info">
					{formatVariantBadgeLabel(inclusion.variantCount)}
				</Badge>
			</TableCell>
			<TableCell>
				{inclusion.standardPrice === undefined ? (
					<span className="text-muted-foreground">—</span>
				) : (
					<Badge size="lg" variant="purple">
						{audFormatter.format(inclusion.standardPrice)}
					</Badge>
				)}
			</TableCell>
			<TableCell>
				{inclusion.standardLabourPrice === undefined ? (
					<span className="text-muted-foreground">—</span>
				) : (
					<Badge size="lg" variant="teal">
						{audFormatter.format(inclusion.standardLabourPrice)}
					</Badge>
				)}
			</TableCell>
			<TableCell>
				<div className="flex justify-end">
					<Group>
						<EditInclusion
							inclusionId={inclusion._id}
							initialCategoryId={inclusion.categoryId}
							initialMeasurementUnit={inclusion.measurementUnit}
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
							inclusionId={inclusion._id}
							inclusionTitle={inclusion.title}
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
				</div>
			</TableCell>
		</TableRow>
	);
}

function EmptyInclusionsState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SquaresIntersect aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No inclusions yet</EmptyTitle>
				<EmptyDescription>
					Create your first inclusion using the Add Inclusion button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

function CategoryInclusionsFrame({
	categoryId,
	categoryName,
	categoryCode,
	allowance,
	labourAllowance,
	inclusions: categoryInclusions,
}: {
	categoryId: Id<'inclusionCategories'>;
	categoryName: string;
	categoryCode: string;
	allowance?: number;
	labourAllowance?: number;
	inclusions: Inclusion[];
}) {
	const count = categoryInclusions.length;
	const baseTotal = categoryInclusions.reduce(
		(sum, inclusion) => sum + (inclusion.standardPrice ?? 0),
		0
	);
	const labourTotal = categoryInclusions.reduce(
		(sum, inclusion) => sum + (inclusion.standardLabourPrice ?? 0),
		0
	);

	return (
		<Frame id={categoryId}>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<div className="flex min-w-0 flex-wrap items-center gap-2">
					<FrameTitle className="min-w-0 truncate text-base">
						{categoryName}
					</FrameTitle>
					{allowance === undefined ? null : (
						<Badge className="shrink-0" size="lg" variant="purple">
							{`Base ${audFormatter.format(allowance)}`}
						</Badge>
					)}
					{labourAllowance === undefined ? null : (
						<Badge className="shrink-0" size="lg" variant="teal">
							{`Labour ${audFormatter.format(labourAllowance)}`}
						</Badge>
					)}
				</div>
				<div className="flex flex-wrap items-center justify-end gap-2">
					<Badge className="shrink-0" size="lg" variant="secondary">
						{inclusionCountBadgeLabel(count)}
					</Badge>
					<EditInclusionCategory
						categoryId={categoryId}
						initialAllowance={allowance}
						initialCode={categoryCode}
						initialLabourAllowance={labourAllowance}
						initialName={categoryName}
						trigger={
							<Button
								aria-label={`Edit ${categoryName}`}
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<AddInclusion
						initialCategoryId={categoryId}
						trigger={
							<Button
								aria-label={`Add inclusion to ${categoryName}`}
								size="icon"
								type="button"
								variant="outline"
							>
								<Plus />
							</Button>
						}
					/>
				</div>
			</FrameHeader>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead className="w-36">Variants</TableHead>
						<TableHead className="w-36">Base price</TableHead>
						<TableHead className="w-36">Labour price</TableHead>
						<TableHead className="w-28 text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categoryInclusions.map((inclusion) => (
						<InclusionRow
							categoryId={categoryId}
							inclusion={inclusion}
							key={inclusion._id}
						/>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell className="font-semibold">Total</TableCell>
						<TableCell />
						<TableCell className="font-semibold">
							{audFormatter.format(baseTotal)}
						</TableCell>
						<TableCell className="font-semibold">
							{audFormatter.format(labourTotal)}
						</TableCell>
						<TableCell />
					</TableRow>
				</TableFooter>
			</Table>
		</Frame>
	);
}

export default function InclusionCataloguePageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const categories = useQuery(api.inclusionCategories.list.list, {});
	const listResults = useQuery(
		api.inclusions.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.inclusions.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const inclusions = trimmedSearch === '' ? listResults : searchResults;

	const categoryNameById = useMemo(() => {
		const m = new Map<Id<'inclusionCategories'>, string>();
		for (const c of categories ?? []) {
			m.set(c._id, c.name);
		}
		return m;
	}, [categories]);

	const categoryById = useMemo(() => {
		const m = new Map<Id<'inclusionCategories'>, InclusionCategory>();
		for (const c of categories ?? []) {
			m.set(c._id, c);
		}
		return m;
	}, [categories]);

	const inclusionsByCategoryId = useMemo(() => {
		const m = new Map<Id<'inclusionCategories'>, Inclusion[]>();
		for (const row of inclusions ?? []) {
			const prev = m.get(row.categoryId);
			if (prev) {
				prev.push(row);
			} else {
				m.set(row.categoryId, [row]);
			}
		}
		for (const arr of m.values()) {
			arr.sort((a, b) =>
				a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
			);
		}
		return m;
	}, [inclusions]);

	const searchCategoryOrder = useMemo(() => {
		if (trimmedSearch === '' || !inclusions?.length) {
			return [];
		}
		const ids = [...new Set(inclusions.map((i) => i.categoryId))];
		ids.sort((a, b) =>
			(categoryNameById.get(a) ?? '').localeCompare(
				categoryNameById.get(b) ?? '',
				undefined,
				{ sensitivity: 'base' }
			)
		);
		return ids;
	}, [trimmedSearch, inclusions, categoryNameById]);

	const categoriesWithInclusions = useMemo(() => {
		if (!categories) {
			return [];
		}
		return categories.filter(
			(c) => (inclusionsByCategoryId.get(c._id)?.length ?? 0) > 0
		);
	}, [categories, inclusionsByCategoryId]);

	const hasScrolledRef = useRef(false);
	useEffect(() => {
		if (hasScrolledRef.current) {
			return;
		}
		if (categoriesWithInclusions.length === 0) {
			return;
		}
		const hash = window.location.hash;
		if (!hash) {
			return;
		}
		const element = document.getElementById(hash.slice(1));
		if (!element) {
			return;
		}
		hasScrolledRef.current = true;
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [categoriesWithInclusions]);

	let content: ReactNode;

	if (
		inclusions === undefined ||
		(trimmedSearch === '' && categories === undefined)
	) {
		content = (
			<div className="text-muted-foreground text-sm">Loading inclusions…</div>
		);
	} else if (trimmedSearch !== '' && inclusions.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<SquaresIntersect aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching inclusions</EmptyTitle>
					<EmptyDescription>
						Try another title or category name.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (trimmedSearch === '') {
		if (categoriesWithInclusions.length === 0) {
			content = <EmptyInclusionsState />;
		} else {
			content = (
				<div className="flex flex-col gap-6">
					{categoriesWithInclusions.map((category) => (
						<CategoryInclusionsFrame
							allowance={category.allowance}
							categoryCode={category.code}
							categoryId={category._id}
							categoryName={category.name}
							inclusions={inclusionsByCategoryId.get(category._id) ?? []}
							key={category._id}
							labourAllowance={category.labourAllowance}
						/>
					))}
				</div>
			);
		}
	} else {
		content = (
			<div className="flex flex-col gap-6">
				{searchCategoryOrder.map((categoryId) => (
					<CategoryInclusionsFrame
						allowance={categoryById.get(categoryId)?.allowance}
						categoryCode={categoryById.get(categoryId)?.code ?? ''}
						categoryId={categoryId}
						categoryName={
							categoryNameById.get(categoryId) ?? 'Unknown category'
						}
						inclusions={inclusionsByCategoryId.get(categoryId) ?? []}
						key={categoryId}
						labourAllowance={categoryById.get(categoryId)?.labourAllowance}
					/>
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading
					className="mb-0"
					heading="Inclusions"
					icon={SquaresIntersect}
				/>
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search inclusions"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by title or category…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddInclusion />
				</div>
			</div>
			{content}
		</div>
	);
}
