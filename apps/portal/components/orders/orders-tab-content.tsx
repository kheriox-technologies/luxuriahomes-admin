'use no memo';
'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import {
	ChevronDownIcon,
	ChevronsDownIcon,
	ChevronsUpIcon,
	ClipboardList,
	EllipsisVertical,
	ExternalLink,
	FileText,
	History,
	Link,
	Mail,
	Pencil,
	SearchIcon,
	StickyNote,
	Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatBudgetPrice } from '@/components/budgets/budget-form-shared';
import ComposeEmailDialog from '@/components/email/compose-email-dialog';
import TradeSelect from '@/components/trades/trade-select';
import { formatAud } from '@/lib/currency';
import type { ComposeAttachment } from '@/lib/email';
import {
	generateProjectOrderPdfBase64,
	openProjectOrderPdfInNewTab,
} from '@/lib/pdf/project-order-pdf';
import AddOrder from './add-order';
import AddToTaskDialog from './add-to-task-dialog';
import DeleteOrder from './delete-order';
import EditOrder from './edit-order';
import { ORDER_STATUSES, type OrderStatus } from './order-form-shared';
import OrderNotesDialog from './order-notes-dialog';
import OrderStatusHistoryDialog from './order-status-history-dialog';

type ProjectOrder = Doc<'projectOrders'> & {
	noteCount: number;
	tradeName: string;
	linkedOrderTaskName: string | null;
	linkedParentTaskName: string | null;
};

interface PdfProjectAddress {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
}

interface OrderGroup {
	budgetPrice: number | null;
	key: string;
	orders: ProjectOrder[];
	remaining: number | null;
	tradeName: string;
}

function orderStatusBadgeVariant(
	status: OrderStatus
): 'warning' | 'info' | 'purple' | 'success' {
	switch (status) {
		case 'Pending':
			return 'warning';
		case 'Ordered':
			return 'info';
		case 'In Transit':
			return 'purple';
		default:
			return 'success';
	}
}

function OrderActionsCell({
	row,
	projectAddress,
}: {
	row: ProjectOrder;
	projectAddress?: PdfProjectAddress;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(false);
	const [addToTaskOpen, setAddToTaskOpen] = useState(false);
	const [emailOpen, setEmailOpen] = useState(false);
	const [emailAttachments, setEmailAttachments] = useState<ComposeAttachment[]>(
		[]
	);

	const handleEmailOrder = async () => {
		if (!projectAddress) {
			toastManager.add({
				title: 'Could not prepare email',
				description: 'Project address is still loading. Please try again.',
				type: 'error',
			});
			return;
		}
		try {
			const base64 = await generateProjectOrderPdfBase64({
				orderId: row.orderId,
				vendor: row.vendor,
				items: row.items,
				projectAddress,
			});
			setEmailAttachments([
				{
					id: crypto.randomUUID(),
					filename: `${row.orderId}.pdf`,
					contentType: 'application/pdf',
					contentBase64: base64,
					removable: true,
				},
			]);
			setEmailOpen(true);
		} catch (error) {
			toastManager.add({
				title: 'Could not prepare email',
				description:
					error instanceof Error
						? error.message
						: 'Please try again in a moment.',
				type: 'error',
			});
		}
	};

	const handleViewOrderPdf = async () => {
		if (!projectAddress) {
			toastManager.add({
				title: 'Could not generate PDF',
				description: 'Project address is still loading. Please try again.',
				type: 'error',
			});
			return;
		}
		try {
			await openProjectOrderPdfInNewTab({
				orderId: row.orderId,
				vendor: row.vendor,
				items: row.items,
				projectAddress,
			});
		} catch (error) {
			toastManager.add({
				title: 'Could not generate PDF',
				description:
					error instanceof Error
						? error.message
						: 'Please try again in a moment.',
				type: 'error',
			});
		}
	};

	return (
		<>
			<EditOrder onOpenChange={setEditOpen} open={editOpen} order={row} />
			<DeleteOrder
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				orderId={row._id as Id<'projectOrders'>}
				orderName={row.vendor}
			/>
			<OrderNotesDialog
				onOpenChange={setNotesOpen}
				open={notesOpen}
				orderId={row._id as Id<'projectOrders'>}
			/>
			<OrderStatusHistoryDialog
				onOpenChange={setHistoryOpen}
				open={historyOpen}
				orderId={row._id as Id<'projectOrders'>}
			/>
			<AddToTaskDialog
				onOpenChange={setAddToTaskOpen}
				open={addToTaskOpen}
				order={row}
			/>
			<ComposeEmailDialog
				defaultAttachments={emailAttachments}
				defaultSubject={`Order ${row.orderId} — ${row.vendor}`}
				onOpenChange={setEmailOpen}
				open={emailOpen}
				projectId={row.projectId}
				relatedId={row._id}
				relatedTable="projectOrders"
			/>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Order actions"
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
					<MenuItem onClick={() => setAddToTaskOpen(true)}>
						<Link /> Add to task
					</MenuItem>
					<MenuItem onClick={() => setNotesOpen(true)}>
						<StickyNote /> View / Edit Notes
					</MenuItem>
					<MenuItem onClick={() => setHistoryOpen(true)}>
						<History /> View Status History
					</MenuItem>
					<MenuItem onClick={handleViewOrderPdf}>
						<FileText /> View Order
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleEmailOrder().catch(() => {
								/* Error handled in handleEmailOrder */
							});
						}}
					>
						<Mail /> Email Order
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

function OrderVendorCell({ row }: { row: ProjectOrder }) {
	const [notesOpen, setNotesOpen] = useState(false);
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<span className="font-medium">{row.vendor}</span>
			</div>
			{row.noteCount > 0 ? (
				<>
					<OrderNotesDialog
						onOpenChange={setNotesOpen}
						open={notesOpen}
						orderId={row._id as Id<'projectOrders'>}
					/>
					<button
						className="w-fit"
						onClick={() => setNotesOpen(true)}
						type="button"
					>
						<Badge size="lg" variant="secondary">
							{row.noteCount} {row.noteCount === 1 ? 'Note' : 'Notes'}
						</Badge>
					</button>
				</>
			) : null}
		</div>
	);
}

function orderTotalPrice(order: ProjectOrder): number {
	return order.items.reduce(
		(sum, item) => sum + (item.price ?? 0) * item.quantity,
		0
	);
}

function formatOrderByDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

function OrdersTable({
	orders,
	projectAddress,
}: {
	orders: ProjectOrder[];
	projectAddress?: PdfProjectAddress;
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Order ID</TableHead>
					<TableHead>Vendor</TableHead>
					<TableHead>Items</TableHead>
					<TableHead>Linked Task</TableHead>
					<TableHead>Order By</TableHead>
					<TableHead>Deliver By</TableHead>
					<TableHead>Total Price</TableHead>
					<TableHead>Status</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map((order) => (
					<TableRow key={order._id}>
						<TableCell>
							<span className="font-mono text-sm">{order.orderId}</span>
						</TableCell>
						<TableCell>
							<OrderVendorCell row={order} />
						</TableCell>
						<TableCell>
							<div className="flex flex-col gap-0.5">
								{order.items.map((item) => (
									<div className="flex items-center gap-1.5" key={item.name}>
										<span className="text-sm">{item.name}</span>
										{item.link ? (
											<a
												aria-label="View item link"
												href={item.link}
												rel="noopener noreferrer"
												target="_blank"
											>
												<ExternalLink className="size-3 text-muted-foreground" />
											</a>
										) : null}
										<span className="text-muted-foreground text-xs">
											({item.quantity} {item.unit})
										</span>
									</div>
								))}
							</div>
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground text-sm">
								{order.linkedParentTaskName
									? `${order.linkedParentTaskName} · ${order.linkedOrderTaskName}`
									: '—'}
							</span>
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground text-sm">
								{order.orderBy ? formatOrderByDate(order.orderBy) : '—'}
							</span>
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground text-sm">
								{order.deliverBy ? formatOrderByDate(order.deliverBy) : '—'}
							</span>
						</TableCell>
						<TableCell>
							<span className="font-medium text-sm">
								{formatAud(orderTotalPrice(order))}
							</span>
						</TableCell>
						<TableCell>
							<Badge
								size="lg"
								variant={orderStatusBadgeVariant(order.status as OrderStatus)}
							>
								{order.status}
							</Badge>
						</TableCell>
						<TableCell className="text-right">
							<OrderActionsCell projectAddress={projectAddress} row={order} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default function ProjectOrdersTabContent({
	projectId,
	orderIdFilter = '',
	orderTaskIdFilter,
	initialTradeId,
}: {
	projectId: Id<'projects'>;
	orderIdFilter?: string;
	orderTaskIdFilter?: string;
	initialTradeId?: Id<'trades'>;
}) {
	const project = useQuery(api.projects.get.get, { projectId });
	const orders = useQuery(api.projectOrders.list.list, { projectId });
	const tradeSummary = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	});
	const [search, setSearch] = useState(orderIdFilter);
	const [filterTradeIds, setFilterTradeIds] = useState<Id<'trades'>[]>(
		initialTradeId ? [initialTradeId] : []
	);
	const [filterStatuses, setFilterStatuses] = useState<OrderStatus[]>([]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	const trimmedSearch = search.trim();

	const budgetByTradeId = useMemo(() => {
		const map = new Map<
			Id<'trades'>,
			{ budgetPrice: number | null; remaining: number | null }
		>();
		for (const row of tradeSummary ?? []) {
			const remaining =
				row.budgetPrice === null
					? null
					: row.budgetPrice - (row.totalQuotationPrice + row.totalOrderPrice);
			map.set(row.tradeId, {
				budgetPrice: row.budgetPrice,
				remaining,
			});
		}
		return map;
	}, [tradeSummary]);

	const groups = useMemo<OrderGroup[]>(() => {
		if (!orders) {
			return [];
		}
		const lowerSearch = trimmedSearch.toLowerCase();
		const filtered = orders.filter((o) => {
			if (orderTaskIdFilter && o.orderTaskId !== orderTaskIdFilter) {
				return false;
			}
			if (filterTradeIds.length > 0 && !filterTradeIds.includes(o.tradeId)) {
				return false;
			}
			if (
				filterStatuses.length > 0 &&
				!filterStatuses.includes(o.status as OrderStatus)
			) {
				return false;
			}
			if (lowerSearch && !o.orderId.toLowerCase().includes(lowerSearch)) {
				return false;
			}
			return true;
		});

		const map = new Map<string, OrderGroup>();
		for (const o of filtered) {
			const key = o.tradeId as string;
			let group = map.get(key);
			if (!group) {
				const budget = budgetByTradeId.get(o.tradeId);
				group = {
					budgetPrice: budget?.budgetPrice ?? null,
					key,
					orders: [],
					remaining: budget?.remaining ?? null,
					tradeName: o.tradeName,
				};
				map.set(key, group);
			}
			group.orders.push(o);
		}

		const arr = [...map.values()];
		arr.sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, {
				sensitivity: 'base',
			})
		);
		return arr;
	}, [
		orders,
		trimmedSearch,
		orderTaskIdFilter,
		filterTradeIds,
		filterStatuses,
		budgetByTradeId,
	]);

	let content: React.ReactNode;

	if (orders === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading orders…</div>
		);
	} else if (orders.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ClipboardList aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No orders yet</EmptyTitle>
					<EmptyDescription>
						Orders for this project will appear here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (groups.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ClipboardList aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching orders</EmptyTitle>
					<EmptyDescription>
						Try a different trade or search term.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<Accordion
				className="rounded-xl border"
				multiple
				onValueChange={(value) => setOpenKeys(value as string[])}
				value={openKeys}
			>
				{groups.map((group) => (
					<AccordionItem
						className="border-b last:border-b-0"
						key={group.key}
						value={group.key}
					>
						<AccordionPrimitive.Header className="flex">
							<AccordionPrimitive.Trigger
								className={cn(
									'flex flex-1 cursor-pointer items-center justify-between gap-2 px-4 py-3 outline-none transition-colors hover:bg-muted/40',
									'focus-visible:ring-[3px] focus-visible:ring-ring',
									'[&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180'
								)}
								type="button"
							>
								<span className="flex items-center gap-2 font-medium text-sm">
									{group.tradeName}
									<ChevronDownIcon
										className="size-4 shrink-0 opacity-70 transition-transform duration-200"
										data-slot="accordion-indicator"
									/>
									<Badge size="lg" variant="outline">
										{group.orders.length}
									</Badge>
								</span>
								<span className="flex items-center gap-2">
									{group.budgetPrice === null ? (
										<Badge size="lg" variant="outline">
											No budget
										</Badge>
									) : (
										<>
											<Badge size="lg" variant="purple">
												Budget {formatBudgetPrice(group.budgetPrice)}
											</Badge>
											<Badge
												size="lg"
												variant={
													(group.remaining ?? 0) >= 0
														? 'success-outline'
														: 'destructive-outline'
												}
											>
												Remaining {formatBudgetPrice(group.remaining ?? 0)}
											</Badge>
										</>
									)}
								</span>
							</AccordionPrimitive.Trigger>
						</AccordionPrimitive.Header>
						<AccordionPanel className="overflow-x-auto p-0">
							<OrdersTable
								orders={group.orders}
								projectAddress={project?.address}
							/>
						</AccordionPanel>
					</AccordionItem>
				))}
			</Accordion>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 lg:flex-row lg:items-start">
				<InputGroup className="w-full lg:w-64 lg:shrink-0">
					<InputGroupAddon align="inline-start">
						<InputGroupText>
							<SearchIcon aria-hidden />
						</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						aria-label="Search orders by ID"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by order ID (LHA-XXXXXX)…"
						type="search"
						value={search}
					/>
				</InputGroup>

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
						<Combobox<OrderStatus, true>
							items={[...ORDER_STATUSES]}
							itemToStringLabel={(item) => item ?? ''}
							multiple
							onValueChange={(next) =>
								setFilterStatuses((next as OrderStatus[] | null) ?? [])
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
									{(item: OrderStatus) => (
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
					{groups.length > 0 ? (
						<>
							<Button
								onClick={() => setOpenKeys(groups.map((g) => g.key))}
								type="button"
								variant="outline"
							>
								<ChevronsDownIcon />
								Expand All
							</Button>
							<Button
								onClick={() => setOpenKeys([])}
								type="button"
								variant="outline"
							>
								<ChevronsUpIcon />
								Collapse All
							</Button>
						</>
					) : null}
					<AddOrder projectId={projectId} />
				</div>
			</div>
			{content}
		</div>
	);
}
