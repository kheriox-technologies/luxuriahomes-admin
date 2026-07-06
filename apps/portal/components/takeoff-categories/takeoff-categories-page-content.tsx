'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, Ruler, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddTakeoffCategory from './add-takeoff-category';
import DeleteTakeoffCategory from './delete-takeoff-category';
import EditTakeoffCategory from './edit-takeoff-category';

type TakeoffCategory = Doc<'takeoffCategories'>;

const columns: ColumnDef<TakeoffCategory>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<Group>
					<EditTakeoffCategory
						initialName={row.original.name}
						takeoffCategoryId={row.original._id}
						trigger={
							<Button
								aria-label="Edit take offs category"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteTakeoffCategory
						categoryName={row.original.name}
						takeoffCategoryId={row.original._id}
						trigger={
							<Button
								aria-label="Delete take offs category"
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
		),
	},
];

function EmptyTakeoffCategoriesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Ruler aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No take offs categories yet</EmptyTitle>
				<EmptyDescription>
					Create your first take offs category using the Add Take Offs Category
					button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function TakeoffCategoriesPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.takeoffCategories.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.takeoffCategories.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const takeoffCategories = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (takeoffCategories === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading take offs categories…
			</div>
		);
	} else if (trimmedSearch !== '' && takeoffCategories.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Ruler aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching take offs categories</EmptyTitle>
					<EmptyDescription>Try a different name.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (takeoffCategories.length === 0) {
		content = <EmptyTakeoffCategoriesState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={takeoffCategories}
				emptyMessage="No matching take offs categories."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Take Offs Categories"
				icon={Ruler}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search take offs categories"
							onValueChange={setSearch}
							placeholder="Search by name…"
							value={search}
						/>
						<AddTakeoffCategory />
					</>
				}
			/>
			{content}
		</div>
	);
}
