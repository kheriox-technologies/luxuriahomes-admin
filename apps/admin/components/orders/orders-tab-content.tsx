'use no memo';
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import { useQuery } from 'convex/react';
import {
	ClipboardList,
	EllipsisVertical,
	ExternalLink,
	FileText,
	History,
	Link,
	Pencil,
	SearchIcon,
	StickyNote,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { openProjectOrderPdfInNewTab } from '@/lib/pdf/project-order-pdf';
import AddOrder from './add-order';
import AddToTaskDialog from './add-to-task-dialog';
import DeleteOrder from './delete-order';
import EditOrder from './edit-order';
import type { OrderStatus } from './order-form-shared';
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

function formatOrderByDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

function buildColumns(
	projectAddress?: PdfProjectAddress
): ColumnDef<ProjectOrder>[] {
	return [
		{
			id: 'orderId',
			header: 'Order ID',
			size: 130,
			cell: ({ row }) => (
				<span className="font-mono text-sm">{row.original.orderId}</span>
			),
		},
		{
			id: 'vendor',
			header: 'Vendor',
			cell: ({ row }) => <OrderVendorCell row={row.original} />,
		},
		{
			id: 'items',
			header: 'Items',
			cell: ({ row }) => (
				<div className="flex flex-col gap-0.5">
					{row.original.items.map((item) => (
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
			),
		},
		{
			id: 'linkedTask',
			header: 'Linked Task',
			size: 160,
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.linkedParentTaskName
						? `${row.original.linkedParentTaskName} · ${row.original.linkedOrderTaskName}`
						: '—'}
				</span>
			),
		},
		{
			id: 'orderBy',
			header: 'Order By',
			size: 130,
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.orderBy ? formatOrderByDate(row.original.orderBy) : '—'}
				</span>
			),
		},
		{
			id: 'deliverBy',
			header: 'Deliver By',
			size: 130,
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.deliverBy
						? formatOrderByDate(row.original.deliverBy)
						: '—'}
				</span>
			),
		},
		{
			id: 'status',
			header: 'Status',
			size: 140,
			cell: ({ row }) => (
				<Badge
					size="lg"
					variant={orderStatusBadgeVariant(row.original.status as OrderStatus)}
				>
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
					<OrderActionsCell
						projectAddress={projectAddress}
						row={row.original}
					/>
				</div>
			),
		},
	];
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
	const columns = buildColumns(project?.address);
	const [search, setSearch] = useState(orderIdFilter);

	const trimmedSearch = search.trim();
	const filteredOrders = (() => {
		if (!orders) {
			return [];
		}
		let result = orders;
		if (orderTaskIdFilter) {
			result = result.filter((o) => o.orderTaskId === orderTaskIdFilter);
		}
		if (trimmedSearch !== '') {
			result = result.filter((o) =>
				o.orderId.toLowerCase().includes(trimmedSearch.toLowerCase())
			);
		}
		return result;
	})();

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
	} else {
		content = (
			<DataTable
				columns={columns}
				data={filteredOrders}
				emptyMessage="No orders found."
				initialPageSize={20}
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<InputGroup className="min-w-0 flex-1">
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
				<AddOrder projectId={projectId} />
			</div>
			{content}
		</div>
	);
}
