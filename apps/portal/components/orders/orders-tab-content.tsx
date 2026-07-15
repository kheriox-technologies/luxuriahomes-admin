'use no memo';
'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import { useQuery } from 'convex/react';
import {
	ClipboardList,
	EllipsisVertical,
	ExternalLink,
	FileText,
	History,
	Link,
	Mail,
	Pencil,
	StickyNote,
	Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import ComposeEmailDialog from '@/components/email/compose-email-dialog';
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
	linkedOrderTaskName: string | null;
	linkedParentTaskName: string | null;
};

interface PdfProjectAddress {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
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
}: {
	projectId: Id<'projects'>;
	orderIdFilter?: string;
	orderTaskIdFilter?: string;
}) {
	const project = useQuery(api.projects.get.get, { projectId });
	const orders = useQuery(api.projectOrders.list.list, { projectId });
	const [search, setSearch] = useState(orderIdFilter);
	const [filterStatuses, setFilterStatuses] = useState<OrderStatus[]>([]);

	const trimmedSearch = search.trim();

	// Flat, newest-first list (the query already returns descending by creation).
	const filteredOrders = useMemo<ProjectOrder[]>(() => {
		if (!orders) {
			return [];
		}
		const lowerSearch = trimmedSearch.toLowerCase();
		return orders.filter((o) => {
			if (orderTaskIdFilter && o.orderTaskId !== orderTaskIdFilter) {
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
	}, [orders, trimmedSearch, orderTaskIdFilter, filterStatuses]);

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
	} else if (filteredOrders.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ClipboardList aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching orders</EmptyTitle>
					<EmptyDescription>
						Try a different search term or status.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<OrdersTable orders={filteredOrders} projectAddress={project?.address} />
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 lg:flex-row lg:items-start">
				<div className="lg:flex-1">
					<SearchInput
						aria-label="Search orders by ID"
						onValueChange={setSearch}
						placeholder="Search by order ID (LHA-XXXXXX)…"
						value={search}
					/>
				</div>

				<div className="flex flex-wrap items-center gap-2 lg:shrink-0">
					<div className="w-full sm:w-52">
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

					<AddOrder projectId={projectId} />
				</div>
			</div>
			{content}
		</div>
	);
}
