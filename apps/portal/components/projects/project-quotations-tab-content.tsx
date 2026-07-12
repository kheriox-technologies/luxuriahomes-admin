'use client';
// React Compiler can't track mutations on the TanStack Table instance.
'use no memo';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { SearchInput } from '@workspace/ui/components/search-input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import {
	Ban,
	Check,
	ChevronsDownIcon,
	ChevronsUpIcon,
	DollarSign,
	EllipsisVertical,
	ExternalLink,
	Pencil,
	Plus,
	StickyNote,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { signCdnUrl } from '@/actions/cdn';
import { formatBudgetPrice } from '@/components/budgets/budget-form-shared';
import AddQuotation from '@/components/quotations/add-quotation';
import DeleteQuotation from '@/components/quotations/delete-quotation';
import EditQuotation from '@/components/quotations/edit-quotation';
import type { QuotationFormValues } from '@/components/quotations/quotation-form-shared';
import QuotationNotesDialog from '@/components/quotations/quotation-notes-dialog';
import {
	StageGroupedTradeAccordion,
	type StageGroupedTradeAccordionHandle,
	type TradeAccordionItem,
} from '@/components/trades/stage-grouped-trade-accordion';
import TradeSelect from '@/components/trades/trade-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';

interface ProjectQuotation {
	_id: Id<'projectQuotations'>;
	companyName: string;
	noteCount: number;
	price: number;
	projectId: Id<'projects'>;
	s3Key?: string;
	searchText: string;
	serviceProviderId: Id<'serviceProviders'>;
	status: QuotationFormValues['status'];
	title: string;
	tradeId: Id<'trades'>;
	tradeName: string;
}

interface TradeGroup {
	budgetPrice: number | null;
	quotes: ProjectQuotation[];
	stageId: Id<'tradeStages'> | null;
	tradeId: Id<'trades'>;
	tradeName: string;
	tradeOrder: number | null;
	// Xero-driven "Actual" for the trade; null when nothing has synced.
	xeroActual: number | null;
}

const STATUS_VALUES: QuotationFormValues['status'][] = [
	'Under Review',
	'Approved',
	'Rejected',
];

function statusBadgeVariant(
	status: QuotationFormValues['status']
): 'success' | 'warning' | 'destructive-outline' {
	if (status === 'Approved') {
		return 'success';
	}
	if (status === 'Rejected') {
		return 'destructive-outline';
	}
	return 'warning';
}

function QuotationActionsCell({ row }: { row: ProjectQuotation }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [isRejecting, setIsRejecting] = useState(false);
	const [isViewingDoc, setIsViewingDoc] = useState(false);

	const approveQuotation = useMutation(api.projectQuotations.approve.approve);
	const rejectQuotation = useMutation(api.projectQuotations.reject.reject);

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

	const handleReject = async () => {
		setIsRejecting(true);
		try {
			await rejectQuotation({ quotationId: row._id });
			toastManager.add({ title: 'Quotation rejected', type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not reject quotation. Please try again.'
				),
				title: 'Could not reject quotation',
				type: 'error',
			});
		} finally {
			setIsRejecting(false);
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
				initialTitle={row.title}
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
			<QuotationNotesDialog
				onOpenChange={setNotesOpen}
				open={notesOpen}
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
					<MenuItem
						disabled={isRejecting || row.status === 'Rejected'}
						onClick={() => {
							handleReject().catch(() => {
								/* Error handled in handleReject */
							});
						}}
					>
						<Ban /> Reject
					</MenuItem>
					<MenuItem onClick={() => setNotesOpen(true)}>
						<StickyNote /> View / Edit Notes
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

function QuotationNotesBadge({ row }: { row: ProjectQuotation }) {
	const [notesOpen, setNotesOpen] = useState(false);
	if (row.noteCount === 0) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	return (
		<>
			<QuotationNotesDialog
				onOpenChange={setNotesOpen}
				open={notesOpen}
				quotationId={row._id}
			/>
			<button onClick={() => setNotesOpen(true)} type="button">
				<Badge size="lg" variant="secondary">
					{row.noteCount} {row.noteCount === 1 ? 'Note' : 'Notes'}
				</Badge>
			</button>
		</>
	);
}

function QuotationPriceCell({ row }: { row: ProjectQuotation }) {
	const [isViewingDoc, setIsViewingDoc] = useState(false);

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
		<span className="flex items-center gap-1">
			<span className="text-sm tabular-nums">
				{formatBudgetPrice(row.price)}
			</span>
			{row.s3Key ? (
				<Button
					aria-label="View quotation document"
					disabled={isViewingDoc}
					onClick={() => {
						handleViewDoc().catch(() => {
							/* Error handled in handleViewDoc */
						});
					}}
					size="icon-sm"
					type="button"
					variant="ghost"
				>
					<ExternalLink className="size-4" />
				</Button>
			) : null}
		</span>
	);
}

export default function ProjectQuotationsTabContent({
	projectId,
	initialTradeId,
	initialStatus,
}: {
	projectId: Id<'projects'>;
	initialTradeId?: Id<'trades'>;
	initialStatus?: QuotationFormValues['status'];
}) {
	const [addOpen, setAddOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [filterTradeIds, setFilterTradeIds] = useState<Id<'trades'>[]>(
		initialTradeId ? [initialTradeId] : []
	);
	const [filterStatuses, setFilterStatuses] = useState<
		QuotationFormValues['status'][]
	>(initialStatus ? [initialStatus] : []);
	const listRef = useRef<StageGroupedTradeAccordionHandle>(null);

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const quotations = useQuery(
		api.projectQuotations.listByProject.listByProject,
		{
			projectId,
		}
	) as ProjectQuotation[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});
	const tradeSummary = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	});

	const budgetByTrade = useMemo(() => {
		const map = new Map<
			Id<'trades'>,
			{
				budgetPrice: number | null;
				stageId: Id<'tradeStages'> | null;
				tradeOrder: number | null;
				xeroActual: number | null;
			}
		>();
		for (const row of tradeSummary ?? []) {
			map.set(row.tradeId, {
				budgetPrice: row.budgetPrice,
				stageId: row.stageId,
				tradeOrder: row.tradeOrder,
				xeroActual: row.xeroActual,
			});
		}
		return map;
	}, [tradeSummary]);

	const trimmedSearch = debouncedSearch.trim().toLowerCase();

	const groups = useMemo<TradeGroup[]>(() => {
		if (!quotations) {
			return [];
		}
		const filtered = quotations.filter((q) => {
			if (filterTradeIds.length > 0 && !filterTradeIds.includes(q.tradeId)) {
				return false;
			}
			if (filterStatuses.length > 0 && !filterStatuses.includes(q.status)) {
				return false;
			}
			if (
				trimmedSearch &&
				!`${q.title} ${q.tradeName} ${q.companyName}`
					.toLowerCase()
					.includes(trimmedSearch)
			) {
				return false;
			}
			return true;
		});

		const map = new Map<Id<'trades'>, TradeGroup>();
		for (const q of filtered) {
			let group = map.get(q.tradeId);
			if (!group) {
				const budget = budgetByTrade.get(q.tradeId);
				group = {
					tradeId: q.tradeId,
					tradeName: q.tradeName,
					budgetPrice: budget?.budgetPrice ?? null,
					stageId: budget?.stageId ?? null,
					tradeOrder: budget?.tradeOrder ?? null,
					xeroActual: budget?.xeroActual ?? null,
					quotes: [],
				};
				map.set(q.tradeId, group);
			}
			group.quotes.push(q);
		}
		const arr = [...map.values()];
		for (const group of arr) {
			group.quotes.sort((a, b) => a.price - b.price);
		}
		arr.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
		return arr;
	}, [
		quotations,
		filterTradeIds,
		filterStatuses,
		trimmedSearch,
		budgetByTrade,
	]);

	const hasFilters =
		filterTradeIds.length > 0 ||
		filterStatuses.length > 0 ||
		trimmedSearch !== '';

	let content: React.ReactNode;

	if (quotations === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading quotations…</div>
		);
	} else if (groups.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<DollarSign aria-hidden />
					</EmptyMedia>
					<EmptyTitle>
						{hasFilters ? 'No matching quotations' : 'No quotations yet'}
					</EmptyTitle>
					<EmptyDescription>
						{hasFilters
							? 'Try a different trade, status, or search term.'
							: 'Add a quotation using the Add Quotation button.'}
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		const items: TradeAccordionItem[] = groups.map((group) => ({
			budgetPrice: group.budgetPrice,
			count: group.quotes.length,
			stageId: group.stageId,
			tradeId: group.tradeId,
			tradeName: group.tradeName,
			tradeOrder: group.tradeOrder,
			xeroActual: group.xeroActual,
			content: (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Service Provider</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Notes</TableHead>
							<TableHead>Status</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{group.quotes.map((quote) => (
							<TableRow key={quote._id}>
								<TableCell className="font-medium">{quote.title}</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{quote.companyName}
								</TableCell>
								<TableCell>
									<QuotationPriceCell row={quote} />
								</TableCell>
								<TableCell>
									<QuotationNotesBadge row={quote} />
								</TableCell>
								<TableCell>
									<Badge size="lg" variant={statusBadgeVariant(quote.status)}>
										{quote.status}
									</Badge>
								</TableCell>
								<TableCell className="text-right">
									<QuotationActionsCell row={quote} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			),
		}));
		content = (
			<StageGroupedTradeAccordion items={items} ref={listRef} stages={stages} />
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 lg:flex-row lg:items-start">
				<SearchInput
					aria-label="Search quotations"
					onValueChange={setSearch}
					placeholder="Search by title, trade, or provider…"
					value={search}
				/>

				<div className="flex flex-1 flex-col gap-2 sm:flex-row">
					<div className="min-w-0 flex-1">
						<TradeSelect
							multiple
							onValueChange={setFilterTradeIds}
							placeholder="All trades"
							value={filterTradeIds}
						/>
					</div>

					<div className="min-w-0 flex-1">
						<Combobox<QuotationFormValues['status'], true>
							items={STATUS_VALUES}
							itemToStringLabel={(item) => item ?? ''}
							multiple
							onValueChange={(next) =>
								setFilterStatuses(
									(next as QuotationFormValues['status'][] | null) ?? []
								)
							}
							value={filterStatuses}
						>
							<ComboboxChips>
								{filterStatuses.map((status) => (
									<ComboboxChip key={status}>{status}</ComboboxChip>
								))}
								<ComboboxChipsInput placeholder="All statuses" />
							</ComboboxChips>
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
				</div>

				<div className="flex flex-wrap items-center gap-2 lg:shrink-0">
					{hasFilters ? (
						<Button
							onClick={() => {
								setSearch('');
								setFilterTradeIds([]);
								setFilterStatuses([]);
							}}
							type="button"
							variant="outline"
						>
							<X />
							Clear
						</Button>
					) : null}

					{groups.length > 0 ? (
						<Group>
							<Button
								aria-label="Expand all"
								onClick={() => listRef.current?.expandAll()}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronsDownIcon />
							</Button>
							<GroupSeparator />
							<Button
								aria-label="Collapse all"
								onClick={() => listRef.current?.collapseAll()}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronsUpIcon />
							</Button>
						</Group>
					) : null}

					<AddQuotation
						defaultStatus="Under Review"
						onOpenChange={setAddOpen}
						open={addOpen}
						projectId={projectId}
						trigger={
							<Button onClick={() => setAddOpen(true)} variant="outline">
								<Plus aria-hidden /> Add Quotation
							</Button>
						}
					/>
				</div>
			</div>
			{content}
		</div>
	);
}
