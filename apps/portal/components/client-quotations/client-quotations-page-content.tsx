'use client';
// React Compiler can't track mutations on the TanStack Table instance.
'use no memo';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
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
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useQuery } from 'convex/react';
import {
	EllipsisVertical,
	ExternalLink,
	FileSignature,
	Plus,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { formatAudWhole } from '@/lib/currency';
import { formatIssueDate } from './client-quotation-form-shared';
import DeleteClientQuotation from './delete-client-quotation';

type QuotationRow = Doc<'clientQuotations'>;

const MS_PER_DAY = 86_400_000;
const NEW_HREF = '/client-quotations/new';

function validUntil(row: QuotationRow): Date {
	return new Date(row.issuedAt + row.validityDays * MS_PER_DAY);
}

function QuotationActionsCell({ row }: { row: QuotationRow }) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const signUrl = useAction(api.cdn.signUrl.signUrl);

	const openPdf = async () => {
		if (!row.s3Key) {
			return;
		}
		try {
			const url = await signUrl({ s3Key: row.s3Key });
			window.open(url, '_blank', 'noopener');
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not open the quotation PDF.'
				),
				title: 'Could not open PDF',
				type: 'error',
			});
		}
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper, not interactive
		<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`${row.reference} actions`}
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem
						disabled={!row.s3Key}
						onClick={() => {
							openPdf().catch(() => {
								/* handled in openPdf */
							});
						}}
					>
						<ExternalLink />
						Open PDF
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<DeleteClientQuotation
				documentId={row.documentId}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				quotationId={row._id}
				reference={row.reference}
			/>
		</div>
	);
}

const columns: ColumnDef<QuotationRow>[] = [
	{
		accessorKey: 'reference',
		header: 'Reference',
		cell: ({ row }) => (
			<span className="font-medium tabular-nums">{row.original.reference}</span>
		),
	},
	{
		accessorKey: 'projectName',
		header: 'Project',
	},
	{
		id: 'clients',
		header: 'Clients',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.clients.map((client) => client.name).join(', ')}
			</span>
		),
	},
	{
		accessorKey: 'totalInclGst',
		header: 'Total incl. GST',
		cell: ({ row }) => (
			<span className="tabular-nums">
				{formatAudWhole(row.original.totalInclGst)}
			</span>
		),
	},
	{
		accessorKey: 'issuedAt',
		header: 'Issued',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{formatIssueDate(new Date(row.original.issuedAt))}
			</span>
		),
	},
	{
		id: 'validUntil',
		header: 'Valid until',
		cell: ({ row }) => {
			const expiry = validUntil(row.original);
			const expired = expiry.getTime() < Date.now();
			return (
				<span className="flex items-center gap-2 text-sm">
					<span className="text-muted-foreground">
						{formatIssueDate(expiry)}
					</span>
					{expired ? <Badge variant="secondary">Expired</Badge> : null}
				</span>
			);
		},
	},
	{
		id: 'actions',
		header: '',
		size: 60,
		cell: ({ row }) => <QuotationActionsCell row={row.original} />,
	},
];

export default function ClientQuotationsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.clientQuotations.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.clientQuotations.search.search,
		trimmedSearch === '' ? 'skip' : { query: trimmedSearch }
	);
	const quotations = trimmedSearch === '' ? listResults : searchResults;

	let content: ReactNode;
	if (quotations === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading quotations…</div>
		);
	} else if (quotations.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileSignature aria-hidden />
					</EmptyMedia>
					<EmptyTitle>
						{trimmedSearch === ''
							? 'No quotations yet'
							: 'No matching quotations'}
					</EmptyTitle>
					<EmptyDescription>
						{trimmedSearch === ''
							? 'Create your first client quotation using the Add Quotation button.'
							: 'Try a different reference, project name or client.'}
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={quotations}
				emptyMessage="No matching quotations."
				initialPageSize={20}
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Client Quotations"
				icon={FileSignature}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search quotations"
							onValueChange={setSearch}
							placeholder="Search by reference, project or client…"
							value={search}
						/>
						<Button render={<Link href={NEW_HREF} />} variant="outline">
							<Plus aria-hidden /> Add Quotation
						</Button>
					</>
				}
			/>
			{content}
		</div>
	);
}
