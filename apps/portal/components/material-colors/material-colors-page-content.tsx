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
import { Palette, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddMaterialColor from './add-material-color';
import DeleteMaterialColor from './delete-material-color';
import EditMaterialColor from './edit-material-color';

type MaterialColor = Doc<'materialColors'>;

const columns: ColumnDef<MaterialColor>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) =>
			row.original.description ? (
				<span className="text-muted-foreground text-sm">
					{row.original.description}
				</span>
			) : null,
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<Group>
					<EditMaterialColor
						initialDescription={row.original.description}
						initialName={row.original.name}
						materialColorId={row.original._id}
						trigger={
							<Button
								aria-label="Edit material color"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteMaterialColor
						materialColorId={row.original._id}
						materialColorName={row.original.name}
						trigger={
							<Button
								aria-label="Delete material color"
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

function EmptyMaterialColorsState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Palette aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No material colors yet</EmptyTitle>
				<EmptyDescription>
					Create your first material color using the Add Material Color button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function MaterialColorsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.materialColors.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.materialColors.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const materialColors = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (materialColors === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading material colors…
			</div>
		);
	} else if (trimmedSearch !== '' && materialColors.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Palette aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching material colors</EmptyTitle>
					<EmptyDescription>
						Try a different name or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (materialColors.length === 0) {
		content = <EmptyMaterialColorsState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={materialColors}
				emptyMessage="No matching material colors."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Material Colors"
				icon={Palette}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search material colors"
							onValueChange={setSearch}
							placeholder="Search by name or description…"
							value={search}
						/>
						<AddMaterialColor />
					</>
				}
			/>
			{content}
		</div>
	);
}
