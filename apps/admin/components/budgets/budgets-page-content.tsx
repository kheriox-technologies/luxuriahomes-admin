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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddBudgetTemplate from './add-budget-template';
import { formatBudgetPrice } from './budget-form-shared';
import DeleteBudgetTemplate from './delete-budget-template';
import EditBudgetTemplate from './edit-budget-template';

type BudgetTemplateRow = Doc<'budgetTemplates'>;

function TemplateActionsCell({ row }: { row: BudgetTemplateRow }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper, not interactive
		<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
			<EditBudgetTemplate
				budgetTemplateId={row._id}
				initialDescription={row.description}
				initialTitle={row.title}
				onOpenChange={setEditOpen}
				open={editOpen}
			/>
			<DeleteBudgetTemplate
				budgetTemplateId={row._id}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				templateTitle={row.title}
			/>
			<Group>
				<Button
					aria-label="Edit budget template"
					onClick={() => setEditOpen(true)}
					size="icon"
					type="button"
					variant="outline"
				>
					<Pencil />
				</Button>
				<GroupSeparator />
				<Button
					aria-label="Delete budget template"
					onClick={() => setDeleteOpen(true)}
					size="icon"
					type="button"
					variant="destructive-outline"
				>
					<Trash2 />
				</Button>
			</Group>
		</div>
	);
}

const columns: ColumnDef<BudgetTemplateRow>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => (
			<span className="font-medium">{row.original.title}</span>
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
		accessorKey: 'totalPrice',
		header: 'Total',
		cell: ({ row }) => (
			<span className="tabular-nums">
				{formatBudgetPrice(row.original.totalPrice)}
			</span>
		),
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => <TemplateActionsCell row={row.original} />,
	},
];

function EmptyTemplatesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Wallet aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No budget templates yet</EmptyTitle>
				<EmptyDescription>
					Create your first template using the Add Template button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function BudgetsPageContent() {
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.budgetTemplates.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.budgetTemplates.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const templates = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (templates === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading budget templates…
			</div>
		);
	} else if (trimmedSearch !== '' && templates.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wallet aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching templates</EmptyTitle>
					<EmptyDescription>
						Try a different title or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (templates.length === 0) {
		content = <EmptyTemplatesState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={templates}
				emptyMessage="No matching templates."
				initialPageSize={20}
				key={trimmedSearch}
				onRowClick={(row) => router.push(`/budgets/${row._id}`)}
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
							aria-label="Search budget templates"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by title or description…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddBudgetTemplate />
				</div>
			</div>
			{content}
		</div>
	);
}
