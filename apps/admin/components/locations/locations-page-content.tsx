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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { MapPin, Pencil, SearchIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddLocation from './add-location';
import DeleteLocation from './delete-location';
import EditLocation from './edit-location';

type Location = Doc<'locations'>;

const columns: ColumnDef<Location>[] = [
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
					<EditLocation
						initialDescription={row.original.description}
						initialName={row.original.name}
						locationId={row.original._id}
						trigger={
							<Button
								aria-label="Edit location"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteLocation
						locationId={row.original._id}
						locationName={row.original.name}
						trigger={
							<Button
								aria-label="Delete location"
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

function EmptyLocationsState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<MapPin aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No locations yet</EmptyTitle>
				<EmptyDescription>
					Create your first location using the Add Location button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function LocationsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.locations.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.locations.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const locations = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (locations === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading locations…</div>
		);
	} else if (trimmedSearch !== '' && locations.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MapPin aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching locations</EmptyTitle>
					<EmptyDescription>
						Try a different name or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (locations.length === 0) {
		content = <EmptyLocationsState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={locations}
				emptyMessage="No matching locations."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Locations" icon={MapPin} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search locations"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or description…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddLocation />
				</div>
			</div>
			{content}
		</div>
	);
}
