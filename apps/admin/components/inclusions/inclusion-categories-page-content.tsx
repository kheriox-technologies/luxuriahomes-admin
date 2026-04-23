'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
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
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Layers, Pencil, SearchIcon, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import AddInclusionCategory from '@/components/inclusions/add-inclusion-category';
import DeleteInclusionCategory from '@/components/inclusions/delete-inclusion-category';
import EditInclusionCategory from '@/components/inclusions/edit-inclusion-category';
import PageHeading from '@/components/page-heading';

type InclusionCategory = Doc<'inclusionCategories'>;

function InclusionCategoryCard({ category }: { category: InclusionCategory }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<div className="min-w-0 flex-1">
					<CardTitle className="truncate leading-tight">
						{category.name}
					</CardTitle>
					<p className="mt-1 truncate font-medium text-muted-foreground text-xs tracking-wide">
						{category.code}
					</p>
				</div>
				<CardAction>
					<div className="flex items-center gap-2">
						<Badge size="lg" variant="info">
							{category.count}
						</Badge>
						<Group>
							<EditInclusionCategory
								categoryId={category._id}
								initialCode={category.code}
								initialName={category.name}
								trigger={
									<Button
										aria-label="Edit category"
										size="icon"
										type="button"
										variant="outline"
									>
										<Pencil />
									</Button>
								}
							/>
							<GroupSeparator />
							<DeleteInclusionCategory
								categoryId={category._id}
								categoryName={category.name}
								trigger={
									<Button
										aria-label="Delete category"
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
				</CardAction>
			</CardHeader>
		</Card>
	);
}

function EmptyCategoriesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Layers aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No categories yet</EmptyTitle>
				<EmptyDescription>
					Create your first inclusion category using the Add Category button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function InclusionCategoriesPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.inclusionCategories.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.inclusionCategories.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const categories = trimmedSearch === '' ? listResults : searchResults;
	let content: ReactNode;

	if (categories === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading categories…</div>
		);
	} else if (categories.length === 0) {
		if (trimmedSearch === '') {
			content = <EmptyCategoriesState />;
		} else {
			content = (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchIcon aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No matching categories</EmptyTitle>
						<EmptyDescription>Try another category name.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			);
		}
	} else {
		content = (
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
				{categories.map((category) => (
					<InclusionCategoryCard category={category} key={category._id} />
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Inclusion Categories" />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search inclusion categories"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search categories by name…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddInclusionCategory />
				</div>
			</div>
			{content}
		</div>
	);
}
