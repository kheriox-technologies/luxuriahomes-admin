'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
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
import { useEffect, useMemo, useState } from 'react';
import AddInclusion from '@/components/inclusions/add-inclusion';
import DeleteInclusion from '@/components/inclusions/delete-inclusion';
import EditInclusion from '@/components/inclusions/edit-inclusion';
import { formatVariantBadgeLabel } from '@/components/inclusions/inclusion-form-shared';
import PageHeading from '@/components/page-heading';

type Inclusion = Doc<'inclusions'>;

function inclusionCountBadgeLabel(count: number): string {
	const noun = count === 1 ? 'Inclusion' : 'Inclusions';
	return `${count} ${noun}`;
}

function InclusionCatalogueCard({
	inclusion,
	categoryName,
	showCategorySubtitle = true,
}: {
	inclusion: Inclusion;
	categoryName: string;
	showCategorySubtitle?: boolean;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<Link
					className="-m-2 flex min-w-0 flex-1 flex-col gap-1 rounded-md p-2 text-foreground no-underline outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					href={`/inclusions/${inclusion._id}` as LinkProps<string>['href']}
				>
					<CardTitle className="truncate leading-tight">
						{inclusion.title}
					</CardTitle>
					{showCategorySubtitle ? (
						<p className="truncate font-medium text-muted-foreground text-xs tracking-wide">
							{categoryName}
						</p>
					) : null}
					<Badge className="mt-1 w-fit" size="lg" variant="info">
						{formatVariantBadgeLabel(inclusion.variantCount)}
					</Badge>
				</Link>
				<CardAction>
					<Group>
						<EditInclusion
							inclusionId={inclusion._id}
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
				</CardAction>
			</CardHeader>
		</Card>
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
	inclusions: categoryInclusions,
	categoryNameById,
}: {
	categoryId: Id<'inclusionCategories'>;
	categoryName: string;
	inclusions: Inclusion[];
	categoryNameById: Map<Id<'inclusionCategories'>, string>;
}) {
	const count = categoryInclusions.length;

	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<FrameTitle className="min-w-0 truncate text-base">
					{categoryName}
				</FrameTitle>
				<div className="flex flex-wrap items-center justify-end gap-2">
					<Badge className="shrink-0" size="lg" variant="secondary">
						{inclusionCountBadgeLabel(count)}
					</Badge>
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
			<FramePanel className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{categoryInclusions.map((inclusion) => (
					<InclusionCatalogueCard
						categoryName={
							categoryNameById.get(inclusion.categoryId) ?? 'Unknown category'
						}
						inclusion={inclusion}
						key={inclusion._id}
						showCategorySubtitle={false}
					/>
				))}
			</FramePanel>
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
							categoryId={category._id}
							categoryName={category.name}
							categoryNameById={categoryNameById}
							inclusions={inclusionsByCategoryId.get(category._id) ?? []}
							key={category._id}
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
						categoryId={categoryId}
						categoryName={
							categoryNameById.get(categoryId) ?? 'Unknown category'
						}
						categoryNameById={categoryNameById}
						inclusions={inclusionsByCategoryId.get(categoryId) ?? []}
						key={categoryId}
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
