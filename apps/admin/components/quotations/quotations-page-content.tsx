'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import {
	Check,
	DollarSign,
	EllipsisVertical,
	ExternalLink,
	Pencil,
	SearchIcon,
	Trash2,
	X,
} from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { signCdnUrl } from '@/actions/cdn';
import PageHeading from '@/components/page-heading';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddQuotation from './add-quotation';
import DeleteQuotation from './delete-quotation';
import EditQuotation from './edit-quotation';
import type { QuotationFormValues } from './quotation-form-shared';

interface Quotation {
	_id: Id<'quotations'>;
	companyName: string;
	price: number;
	projectId: Id<'projects'>;
	projectName: string;
	s3Key?: string;
	searchText: string;
	serviceProviderId: Id<'serviceProviders'>;
	status: QuotationFormValues['status'];
	tradeId: Id<'trades'>;
	tradeName: string;
}

function statusBadgeVariant(
	status: QuotationFormValues['status']
): 'success' | 'warning' | 'destructive' {
	if (status === 'Approved') {
		return 'success';
	}
	if (status === 'Rejected') {
		return 'destructive';
	}
	return 'warning';
}

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-AU', {
		style: 'currency',
		currency: 'AUD',
	}).format(price);
}

function QuotationActionsCell({ row }: { row: Quotation }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [isViewingDoc, setIsViewingDoc] = useState(false);

	const approveQuotation = useMutation(api.quotations.approve.approve);

	const handleApprove = async () => {
		setIsApproving(true);
		try {
			await approveQuotation({ quotationId: row._id });
			toastManager.add({ title: 'Quotation approved', type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not approve quotation. Please try again.'
				),
				title: 'Could not approve quotation',
				type: 'error',
			});
		} finally {
			setIsApproving(false);
		}
	};

	const handleViewDoc = async () => {
		if (!row.s3Key) {
			return;
		}
		setIsViewingDoc(true);
		try {
			const url = await signCdnUrl(row.s3Key);
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch {
			toastManager.add({ title: 'Could not open document.', type: 'error' });
		} finally {
			setIsViewingDoc(false);
		}
	};

	return (
		<>
			<EditQuotation
				initialPrice={row.price}
				initialProjectId={row.projectId}
				initialS3Key={row.s3Key}
				initialServiceProviderId={row.serviceProviderId}
				initialStatus={row.status}
				initialTradeId={row.tradeId}
				onOpenChange={setEditOpen}
				open={editOpen}
				quotationId={row._id}
			/>
			<DeleteQuotation
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				quotationId={row._id}
			/>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Quotation actions"
							size="icon"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil /> Edit
					</MenuItem>
					{row.s3Key ? (
						<MenuItem
							disabled={isViewingDoc}
							onClick={() => {
								handleViewDoc().catch(() => {
									/* Error handled in handleViewDoc */
								});
							}}
						>
							<ExternalLink /> View Quotation
						</MenuItem>
					) : (
						<MenuItem disabled>
							<ExternalLink /> View Quotation
						</MenuItem>
					)}
					<MenuItem
						disabled={isApproving || row.status === 'Approved'}
						onClick={() => {
							handleApprove().catch(() => {
								/* Error handled in handleApprove */
							});
						}}
					>
						<Check /> Approve
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 /> Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
		</>
	);
}

const columns: ColumnDef<Quotation>[] = [
	{
		id: 'trade',
		header: 'Trade',
		cell: ({ row }) => (
			<span className="font-medium">{row.original.tradeName}</span>
		),
	},
	{
		id: 'project',
		header: 'Project',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.projectName}
			</span>
		),
	},
	{
		id: 'serviceProvider',
		header: 'Service Provider',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.companyName}
			</span>
		),
	},
	{
		id: 'price',
		header: 'Price',
		cell: ({ row }) => (
			<span className="text-sm">{formatPrice(row.original.price)}</span>
		),
	},
	{
		id: 'status',
		header: 'Status',
		cell: ({ row }) => (
			<Badge size="sm" variant={statusBadgeVariant(row.original.status)}>
				{row.original.status}
			</Badge>
		),
	},
	{
		id: 'actions',
		header: '',
		size: 60,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<QuotationActionsCell row={row.original} />
			</div>
		),
	},
];

export default function QuotationsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	const [filterProjectId, setFilterProjectId] = useState<Id<'projects'> | null>(
		null
	);
	const [filterTradeId, setFilterTradeId] = useState<Id<'trades'> | null>(null);
	const [filterStatus, setFilterStatus] = useState<
		QuotationFormValues['status'] | null
	>(null);

	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.quotations.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.quotations.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);

	const projects = useQuery(api.projects.list.list, {});
	const trades = useQuery(api.trades.list.list, {});

	const rawData = (trimmedSearch === '' ? listResults : searchResults) as
		| Quotation[]
		| undefined;

	const filteredData = useMemo(() => {
		if (!rawData) {
			return undefined;
		}
		return rawData.filter((row) => {
			if (filterProjectId && row.projectId !== filterProjectId) {
				return false;
			}
			if (filterTradeId && row.tradeId !== filterTradeId) {
				return false;
			}
			if (filterStatus && row.status !== filterStatus) {
				return false;
			}
			return true;
		});
	}, [rawData, filterProjectId, filterTradeId, filterStatus]);

	const hasFilters =
		filterProjectId !== null || filterTradeId !== null || filterStatus !== null;

	const clearFilters = () => {
		setFilterProjectId(null);
		setFilterTradeId(null);
		setFilterStatus(null);
	};

	const projectItems = useMemo(
		() => (projects ?? []).map((p) => p._id),
		[projects]
	);
	const projectLabelById = useMemo(
		() => new Map((projects ?? []).map((p) => [p._id, p.name])),
		[projects]
	);
	const tradeItems = useMemo(() => (trades ?? []).map((t) => t._id), [trades]);
	const tradeLabelById = useMemo(
		() => new Map((trades ?? []).map((t) => [t._id, t.name])),
		[trades]
	);
	const statusItems: QuotationFormValues['status'][] = [
		'Under Review',
		'Approved',
		'Rejected',
	];

	let content: React.ReactNode;

	if (filteredData === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading quotations…</div>
		);
	} else if (trimmedSearch !== '' && filteredData.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<DollarSign aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching quotations</EmptyTitle>
					<EmptyDescription>
						Try a different trade, project, or service provider name.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (filteredData.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<DollarSign aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No quotations yet</EmptyTitle>
					<EmptyDescription>
						Create your first quotation using the Add Quotation button.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={filteredData}
				emptyMessage="No matching quotations."
				initialPageSize={20}
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Quotations" icon={DollarSign} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-72 sm:max-w-sm">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search quotations"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by trade, project, or provider…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<Button
						render={
							<Link href={'/quotations/compare' as LinkProps<string>['href']} />
						}
						variant="outline"
					>
						Compare Quotations
					</Button>
					<AddQuotation />
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div className="grid flex-1 grid-cols-3 gap-2">
					<Combobox<Id<'projects'>>
						items={projectItems}
						itemToStringLabel={(item) => projectLabelById.get(item) ?? ''}
						onValueChange={(next) => setFilterProjectId(next ?? null)}
						value={filterProjectId}
					>
						<ComboboxInput placeholder="All projects" />
						<ComboboxPopup>
							<ComboboxEmpty>No projects found.</ComboboxEmpty>
							<ComboboxList>
								{(item: Id<'projects'>) => (
									<ComboboxItem key={item} value={item}>
										{projectLabelById.get(item) ?? item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxPopup>
					</Combobox>

					<Combobox<Id<'trades'>>
						items={tradeItems}
						itemToStringLabel={(item) => tradeLabelById.get(item) ?? ''}
						onValueChange={(next) => setFilterTradeId(next ?? null)}
						value={filterTradeId}
					>
						<ComboboxInput placeholder="All trades" />
						<ComboboxPopup>
							<ComboboxEmpty>No trades found.</ComboboxEmpty>
							<ComboboxList>
								{(item: Id<'trades'>) => (
									<ComboboxItem key={item} value={item}>
										{tradeLabelById.get(item) ?? item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxPopup>
					</Combobox>

					<Combobox<QuotationFormValues['status']>
						items={statusItems}
						itemToStringLabel={(item) => item ?? ''}
						onValueChange={(next) => setFilterStatus(next ?? null)}
						value={filterStatus}
					>
						<ComboboxInput placeholder="All statuses" />
						<ComboboxPopup>
							<ComboboxList>
								{(item: QuotationFormValues['status']) => (
									<ComboboxItem key={item} value={item}>
										{item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxPopup>
					</Combobox>
				</div>

				<Button
					disabled={!hasFilters}
					onClick={clearFilters}
					type="button"
					variant="outline"
				>
					<X />
					Clear
				</Button>
			</div>

			{content}
		</div>
	);
}
