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
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { useQuery } from 'convex/react';
import {
	ClipboardList,
	EllipsisVertical,
	ExternalLink,
	History,
	Pencil,
	StickyNote,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import AddOrder from './add-order';
import DeleteOrder from './delete-order';
import EditOrder from './edit-order';
import type { OrderStatus } from './order-form-shared';
import OrderNotesDialog from './order-notes-dialog';
import OrderStatusHistoryDialog from './order-status-history-dialog';

type ProjectOrder = Doc<'projectOrders'> & { noteCount: number };

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

function OrderActionsCell({ row }: { row: ProjectOrder }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(false);

	return (
		<>
			<EditOrder onOpenChange={setEditOpen} open={editOpen} order={row} />
			<DeleteOrder
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				orderId={row._id as Id<'projectOrders'>}
				orderName={row.name}
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
					<MenuItem onClick={() => setNotesOpen(true)}>
						<StickyNote /> View / Edit Notes
					</MenuItem>
					<MenuItem onClick={() => setHistoryOpen(true)}>
						<History /> View Status History
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

function OrderNameCell({ row }: { row: ProjectOrder }) {
	const [notesOpen, setNotesOpen] = useState(false);
	return (
		<div className="flex flex-col gap-1">
			<span className="font-medium">{row.name}</span>
			{row.description ? (
				<span className="text-muted-foreground text-xs">{row.description}</span>
			) : null}
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

function buildColumns(): ColumnDef<ProjectOrder>[] {
	return [
		{
			id: 'name',
			header: 'Name',
			cell: ({ row }) => <OrderNameCell row={row.original} />,
		},
		{
			id: 'vendor',
			header: 'Vendor',
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<span className="text-muted-foreground text-sm">
						{row.original.vendor}
					</span>
					{row.original.link ? (
						<a
							aria-label="View link"
							href={row.original.link}
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLink className="size-3.5 text-muted-foreground" />
						</a>
					) : null}
				</div>
			),
		},
		{
			id: 'quantity',
			header: 'Quantity',
			size: 120,
			cell: ({ row }) => (
				<span className="text-sm">
					{row.original.quantity} {row.original.unit}
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
					<OrderActionsCell row={row.original} />
				</div>
			),
		},
	];
}

export default function ProjectOrdersTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const orders = useQuery(api.projectOrders.list.list, { projectId });
	const columns = buildColumns();

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
				data={orders}
				emptyMessage="No orders found."
				initialPageSize={20}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-end">
				<AddOrder projectId={projectId} />
			</div>
			{content}
		</div>
	);
}
