'use client';

import { api } from '@workspace/backend/api';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
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
import type { FunctionReturnType } from 'convex/server';
import {
	ChevronDownIcon,
	EllipsisVertical,
	ExternalLink,
	FileSignature,
	Pencil,
	Plus,
	StickyNote,
	Trash2,
} from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { formatAudWhole } from '@/lib/currency';
import { formatIssueDate } from './client-quotation-form-shared';
import ClientQuotationNotesSheet from './client-quotation-notes-sheet';
import ClientQuotationVersionsPanel from './client-quotation-versions-panel';
import DeleteClientQuotation from './delete-client-quotation';
import { useOpenQuotationPdf } from './use-open-quotation-pdf';

// The list and search queries both return the quotation plus its note count.
type QuotationRow = FunctionReturnType<
	typeof api.clientQuotations.list.list
>[number];

const NEW_HREF = '/quotations/new';
const FIRST_VERSION = 1;

// The header labels and every row are the same grid — including the trailing
// track the actions sit in — so the columns line up exactly. The first column is
// wide enough for a reference and its version badge on one line, and the issued
// column for a spelled-out month.
const ROW_GRID =
	'grid grid-cols-[10.5rem_minmax(0,1.4fr)_minmax(0,1.2fr)_8rem_9.5rem_7rem] items-center gap-3 px-3 text-left';

// Routes are typed, and a template literal can't be proved to be one of them.
function editHref(row: QuotationRow): LinkProps<string>['href'] {
	return `/quotations/${row._id}/edit` as LinkProps<string>['href'];
}

function QuotationRowActions({ row }: { row: QuotationRow }) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const openPdf = useOpenQuotationPdf();

	return (
		<>
			{/* A marker that this quotation has commentary, and a shortcut past the
			    menu to read it. */}
			{row.noteCount > 0 ? (
				<Button
					aria-label={`Notes for ${row.reference}`}
					className="text-muted-foreground"
					onClick={() => setNotesOpen(true)}
					size="icon-sm"
					type="button"
					variant="ghost"
				>
					<StickyNote className="size-4" />
				</Button>
			) : null}
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
					<MenuItem render={<Link href={editHref(row)} />}>
						<Pencil />
						Edit
					</MenuItem>
					<MenuItem
						disabled={!row.s3Key}
						onClick={() => {
							openPdf(row.s3Key).catch(() => {
								/* handled in openPdf */
							});
						}}
					>
						<ExternalLink />
						Open latest PDF
					</MenuItem>
					<MenuItem onClick={() => setNotesOpen(true)}>
						<StickyNote />
						Notes
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<DeleteClientQuotation
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				quotationId={row._id}
				reference={row.reference}
			/>
			<ClientQuotationNotesSheet
				onOpenChange={setNotesOpen}
				open={notesOpen}
				projectName={row.projectName}
				quotationId={row._id}
				reference={row.reference}
			/>
		</>
	);
}

function QuotationAccordionItem({
	expanded,
	row,
}: {
	expanded: boolean;
	row: QuotationRow;
}) {
	const version = row.version ?? FIRST_VERSION;

	return (
		<AccordionItem className="border-b last:border-b-0" value={row._id}>
			<AccordionPrimitive.Header
				className={`${ROW_GRID} relative py-3 text-sm`}
			>
				{/* The whole row toggles, but the cells have to be grid children to
				    align with the labels above — so the trigger is an overlay behind
				    them rather than their parent. */}
				<AccordionPrimitive.Trigger
					aria-label={`Toggle version history for ${row.reference}`}
					className="absolute inset-0 cursor-pointer rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
				/>
				<span className="pointer-events-none relative flex items-center gap-2 whitespace-nowrap">
					<span className="font-medium tabular-nums">{row.reference}</span>
					<Badge variant="secondary">v{version}</Badge>
				</span>
				<span className="pointer-events-none relative truncate">
					{row.projectName}
				</span>
				<span className="pointer-events-none relative truncate text-muted-foreground">
					{row.clients.map((client) => client.name).join(', ')}
				</span>
				<span className="pointer-events-none relative tabular-nums">
					{formatAudWhole(row.totalInclGst)}
				</span>
				<span className="pointer-events-none relative whitespace-nowrap text-muted-foreground">
					{formatIssueDate(new Date(row.issuedAt))}
				</span>
				<span className="relative flex items-center justify-end gap-1">
					<QuotationRowActions row={row} />
					<AccordionPrimitive.Trigger
						aria-label={`Toggle version history for ${row.reference}`}
						className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring data-panel-open:[&>svg]:rotate-180"
					>
						<ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 ease-in-out" />
					</AccordionPrimitive.Trigger>
				</span>
			</AccordionPrimitive.Header>
			<AccordionPanel className="px-3">
				{expanded ? (
					<ClientQuotationVersionsPanel
						latestVersion={version}
						quotationId={row._id}
					/>
				) : null}
			</AccordionPanel>
		</AccordionItem>
	);
}

export default function ClientQuotationsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [openRows, setOpenRows] = useState<string[]>([]);
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
			<div className="overflow-hidden rounded-md border">
				<div
					className={`${ROW_GRID} border-b bg-muted/50 py-2 font-medium text-muted-foreground text-xs uppercase`}
				>
					<span>Reference</span>
					<span>Project</span>
					<span>Clients</span>
					<span>Total incl. GST</span>
					<span>Issued</span>
					<span />
				</div>
				<Accordion
					onValueChange={(value) => setOpenRows(value as string[])}
					value={openRows}
				>
					{quotations.map((row) => (
						<QuotationAccordionItem
							expanded={openRows.includes(row._id)}
							key={row._id}
							row={row}
						/>
					))}
				</Accordion>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Quotations"
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
