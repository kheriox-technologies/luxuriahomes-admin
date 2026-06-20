'use client';
// React Compiler can't track mutations on the TanStack Table instance.
'use no memo';

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
import { Pencil, SearchIcon, Trash2, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddBudget from './add-budget';
import { formatBudgetPrice } from './budget-form-shared';
import DeleteBudget from './delete-budget';
import EditBudget from './edit-budget';

type BudgetRow = Doc<'budgets'> & { tradeName: string | null };

const columns: ColumnDef<BudgetRow>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => (
			<span className="font-medium">{row.original.title}</span>
		),
	},
	{
		accessorKey: 'tradeName',
		header: 'Trade',
		cell: ({ row }) =>
			row.original.tradeName ? (
				<span className="text-sm">{row.original.tradeName}</span>
			) : (
				<span className="text-muted-foreground text-sm">—</span>
			),
	},
	{
		accessorKey: 'price',
		header: 'Price',
		cell: ({ row }) => (
			<span className="tabular-nums">
				{formatBudgetPrice(row.original.price)}
			</span>
		),
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
					<EditBudget
						budgetId={row.original._id}
						initialDescription={row.original.description}
						initialPrice={row.original.price}
						initialTitle={row.original.title}
						initialTradeId={row.original.tradeId}
						trigger={
							<Button
								aria-label="Edit budget"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteBudget
						budgetId={row.original._id}
						budgetTitle={row.original.title}
						trigger={
							<Button
								aria-label="Delete budget"
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

function EmptyBudgetsState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Wallet aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No budgets yet</EmptyTitle>
				<EmptyDescription>
					Create your first budget using the Add Budget button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function BudgetsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.budgets.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.budgets.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const budgets = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (budgets === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading budgets…</div>
		);
	} else if (trimmedSearch !== '' && budgets.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wallet aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching budgets</EmptyTitle>
					<EmptyDescription>Try a different title or trade.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (budgets.length === 0) {
		content = <EmptyBudgetsState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={budgets}
				emptyMessage="No matching budgets."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Budgets" icon={Wallet} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search budgets"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by title or trade…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddBudget />
				</div>
			</div>
			{content}
		</div>
	);
}
