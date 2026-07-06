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
import { ExternalLink, Pencil, Store, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddVendor from './add-vendor';
import DeleteVendor from './delete-vendor';
import EditVendor from './edit-vendor';

type Vendor = Doc<'vendors'>;

const columns: ColumnDef<Vendor>[] = [
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
		accessorKey: 'link',
		header: 'Link',
		cell: ({ row }) =>
			row.original.link ? (
				<a
					className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
					href={row.original.link}
					rel="noopener noreferrer"
					target="_blank"
				>
					<ExternalLink className="size-3 shrink-0" />
					<span className="max-w-48 truncate">{row.original.link}</span>
				</a>
			) : null,
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<Group>
					<EditVendor
						initialDescription={row.original.description}
						initialLink={row.original.link}
						initialName={row.original.name}
						trigger={
							<Button
								aria-label="Edit vendor"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
						vendorId={row.original._id}
					/>
					<GroupSeparator />
					<DeleteVendor
						trigger={
							<Button
								aria-label="Delete vendor"
								size="icon"
								type="button"
								variant="destructive-outline"
							>
								<Trash2 />
							</Button>
						}
						vendorId={row.original._id}
						vendorName={row.original.name}
					/>
				</Group>
			</div>
		),
	},
];

function EmptyVendorsState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Store aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No vendors yet</EmptyTitle>
				<EmptyDescription>
					Create your first vendor using the Add Vendor button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function VendorsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.vendors.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.vendors.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const vendors = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (vendors === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading vendors…</div>
		);
	} else if (trimmedSearch !== '' && vendors.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Store aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching vendors</EmptyTitle>
					<EmptyDescription>
						Try a different name, description, or link.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (vendors.length === 0) {
		content = <EmptyVendorsState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={vendors}
				emptyMessage="No matching vendors."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Vendors"
				icon={Store}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search vendors"
							onValueChange={setSearch}
							placeholder="Search by name, description, or link…"
							value={search}
						/>
						<AddVendor />
					</>
				}
			/>
			{content}
		</div>
	);
}
