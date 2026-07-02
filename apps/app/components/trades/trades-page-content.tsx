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
import { Pencil, SearchIcon, Trash2, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddTrade from './add-trade';
import DeleteTrade from './delete-trade';
import EditTrade from './edit-trade';

type Trade = Doc<'trades'>;

const columns: ColumnDef<Trade>[] = [
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
					<EditTrade
						initialDescription={row.original.description}
						initialName={row.original.name}
						tradeId={row.original._id}
						trigger={
							<Button
								aria-label="Edit trade"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteTrade
						tradeId={row.original._id}
						tradeName={row.original.name}
						trigger={
							<Button
								aria-label="Delete trade"
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

function EmptyTradesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Wrench aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No trades yet</EmptyTitle>
				<EmptyDescription>
					Create your first trade using the Add Trade button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function TradesPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.trades.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.trades.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const trades = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (trades === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading trades…</div>
		);
	} else if (trimmedSearch !== '' && trades.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wrench aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching trades</EmptyTitle>
					<EmptyDescription>
						Try a different name or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (trades.length === 0) {
		content = <EmptyTradesState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={trades}
				emptyMessage="No matching trades."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Trades"
				icon={Wrench}
				rightSlot={
					<>
						<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search trades"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name or description…"
								type="search"
								value={search}
							/>
						</InputGroup>
						<AddTrade />
					</>
				}
			/>
			{content}
		</div>
	);
}
