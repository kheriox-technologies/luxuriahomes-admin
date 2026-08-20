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
import { useQuery } from 'convex/react';
import {
	Copy,
	EllipsisVertical,
	Pencil,
	ScrollText,
	Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddQuotationTemplate from './add-quotation-template';
import DeleteQuotationTemplate from './delete-quotation-template';
import DuplicateQuotationTemplate from './duplicate-quotation-template';
import EditQuotationTemplate from './edit-quotation-template';

const SEARCH_DEBOUNCE_MS = 300;

type QuoteTemplateRow = Doc<'quoteTemplates'>;

function TemplateActionsCell({ row }: { row: QuoteTemplateRow }) {
	const [editOpen, setEditOpen] = useState(false);
	const [duplicateOpen, setDuplicateOpen] = useState(false);
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
							aria-label="Quotation template actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setDuplicateOpen(true)}>
						<Copy />
						Duplicate
					</MenuItem>
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<DuplicateQuotationTemplate
				onOpenChange={setDuplicateOpen}
				open={duplicateOpen}
				sourceDescription={row.description}
				sourceName={row.name}
				sourceTemplateId={row._id}
			/>
			<EditQuotationTemplate
				initialDescription={row.description}
				initialName={row.name}
				onOpenChange={setEditOpen}
				open={editOpen}
				templateId={row._id}
			/>
			<DeleteQuotationTemplate
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				templateId={row._id}
				templateName={row.name}
			/>
		</div>
	);
}

const columns: ColumnDef<QuoteTemplateRow>[] = [
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
		cell: ({ row }) => <TemplateActionsCell row={row.original} />,
	},
];

function TemplatesEmptyState({
	description,
	title,
}: {
	description: string;
	title: string;
}) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ScrollText aria-hidden />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function QuotationTemplatesPageContent() {
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(
			() => setDebouncedSearch(search),
			SEARCH_DEBOUNCE_MS
		);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.quoteTemplates.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.quoteTemplates.search.search,
		trimmedSearch === '' ? 'skip' : { query: trimmedSearch }
	);
	const templates = trimmedSearch === '' ? listResults : searchResults;

	let content: ReactNode;
	if (templates === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading quotation templates…
			</div>
		);
	} else if (trimmedSearch !== '' && templates.length === 0) {
		content = (
			<TemplatesEmptyState
				description="Try a different name or description."
				title="No matching templates"
			/>
		);
	} else if (templates.length === 0) {
		content = (
			<TemplatesEmptyState
				description="Create your first template using the Add Template button, then fill in its items, terms, exclusions and notes."
				title="No quotation templates yet"
			/>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={templates}
				emptyMessage="No matching templates."
				initialPageSize={20}
				key={trimmedSearch}
				onRowClick={(row) => router.push(`/quotation-templates/${row._id}`)}
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				description="Each template holds its own catalogue, terms, exclusions, notes, disclaimer and acknowledgement. Quotations are built from one of them."
				heading="Quotation Templates"
				icon={ScrollText}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search quotation templates"
							onValueChange={setSearch}
							placeholder="Search by name or description…"
							value={search}
						/>
						<AddQuotationTemplate />
					</>
				}
			/>
			{content}
		</div>
	);
}
