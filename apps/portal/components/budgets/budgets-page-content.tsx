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
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Copy, EllipsisVertical, Pencil, Trash2, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddBudgetTemplate from './add-budget-template';
import { formatBudgetPrice } from './budget-form-shared';
import CopyBudgetTemplate from './copy-budget-template';
import DeleteBudgetTemplate from './delete-budget-template';
import EditBudgetTemplate from './edit-budget-template';

type BudgetTemplateRow = Doc<'budgetTemplates'>;

function TemplateActionsCell({ row }: { row: BudgetTemplateRow }) {
	const [editOpen, setEditOpen] = useState(false);
	const [copyOpen, setCopyOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper, not interactive
		<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Budget template actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit
					</MenuItem>
					<MenuItem onClick={() => setCopyOpen(true)}>
						<Copy />
						Copy Template
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditBudgetTemplate
				budgetTemplateId={row._id}
				initialDescription={row.description}
				initialTitle={row.title}
				onOpenChange={setEditOpen}
				open={editOpen}
			/>
			<CopyBudgetTemplate
				onOpenChange={setCopyOpen}
				open={copyOpen}
				sourceBudgetTemplateId={row._id}
				templateTitle={row.title}
			/>
			<DeleteBudgetTemplate
				budgetTemplateId={row._id}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				templateTitle={row.title}
			/>
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
			<PageHeading
				heading="Budgets"
				icon={Wallet}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search budget templates"
							onValueChange={setSearch}
							placeholder="Search by title or description…"
							value={search}
						/>
						<AddBudgetTemplate />
					</>
				}
			/>
			{content}
		</div>
	);
}
