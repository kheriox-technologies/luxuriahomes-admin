'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import {
	Popover,
	PopoverDescription,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import {
	EllipsisVertical,
	ExternalLink,
	GripVertical,
	Link,
	Pencil,
	ShoppingCart,
	Trash2,
	Unlink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	TASK_ROW_HEIGHT,
	TASK_ROW_HEIGHT_WITH_ORDERS,
} from '@/components/schedules/schedule-row-heights';
import LinkOrdersDialog from '../orders/link-orders-dialog';
import AddProjectOrderTask from './add-project-order-task';
import DeleteProjectOrderTask from './delete-project-order-task';
import DeleteProjectTask from './delete-project-task';
import EditProjectTask from './edit-project-task';
import type { OrderForTask } from './project-gantt-panel';

function getOrderStatusBadgeVariant(
	status: string
): 'warning' | 'success' | 'info' | 'purple' {
	switch (status) {
		case 'Delivered':
			return 'success';
		case 'Pending':
			return 'warning';
		case 'In Transit':
			return 'purple';
		default:
			return 'info';
	}
}

function getOrderBadgeClass(orders: OrderForTask[] | undefined): string {
	if (!orders || orders.length === 0) {
		return 'bg-destructive/20 text-destructive dark:text-destructive px-1 py-0 font-semibold text-[9px]';
	}
	if (orders.every((o) => o.status === 'Delivered')) {
		return 'bg-green-500/20 px-1 py-0 font-semibold text-[9px] text-green-700 dark:text-green-300';
	}
	if (orders.some((o) => o.status === 'Pending')) {
		return 'bg-amber-400/20 px-1 py-0 font-semibold text-[9px] text-amber-700 dark:text-amber-300';
	}
	return 'bg-pink-500/20 px-1 py-0 font-semibold text-[9px] text-pink-700 dark:text-pink-300';
}

function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

function OrderBadge({
	order,
	onUnlink,
}: {
	order: OrderForTask;
	onUnlink: () => void;
}) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				nativeButton={false}
				render={
					<Badge
						className="cursor-pointer"
						size="sm"
						variant={getOrderStatusBadgeVariant(order.status)}
					/>
				}
			>
				{order.orderId}
			</PopoverTrigger>
			<PopoverPopup side="bottom" sideOffset={4}>
				<PopoverTitle>
					{order.orderId} · {order.vendor}
				</PopoverTitle>
				<PopoverDescription>Status: {order.status}</PopoverDescription>
				{order.orderBy ? (
					<PopoverDescription>
						Order by: {formatDate(order.orderBy)}
					</PopoverDescription>
				) : null}
				{order.deliverBy ? (
					<PopoverDescription>
						Deliver by: {formatDate(order.deliverBy)}
					</PopoverDescription>
				) : null}
				<div className="mt-2 flex gap-2">
					<Button
						onClick={() => {
							setOpen(false);
							router.push(`?tab=orders&orderId=${order.orderId}`);
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						<ExternalLink />
						View Order
					</Button>
					<Button
						onClick={() => {
							setOpen(false);
							onUnlink();
						}}
						size="sm"
						type="button"
						variant="destructive-outline"
					>
						<Unlink />
						Unlink
					</Button>
				</div>
			</PopoverPopup>
		</Popover>
	);
}

export default function ProjectTaskRow({
	task,
	stageTasks,
	stageStartDate,
	orderTask,
	ordersForTask,
	onNameClick,
	dragHandleProps,
}: {
	task: Doc<'projectTasks'>;
	stageTasks: Doc<'projectTasks'>[];
	stageStartDate: number;
	orderTask?: Doc<'projectOrderTasks'>;
	ordersForTask?: OrderForTask[];
	onNameClick?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addOrderTaskOpen, setAddOrderTaskOpen] = useState(false);
	const [deleteOrderTaskOpen, setDeleteOrderTaskOpen] = useState(false);
	const [linkOrdersOpen, setLinkOrdersOpen] = useState(false);
	const [orderPopoverOpen, setOrderPopoverOpen] = useState(false);
	const updateStatus = useMutation(api.projectTasks.updateStatus.updateStatus);
	const unlinkOrder = useMutation(
		api.projectOrders.linkOrderTask.linkOrderTask
	);

	const hasLinkedOrders = !!ordersForTask && ordersForTask.length > 0;
	const rowHeight =
		orderTask && hasLinkedOrders
			? TASK_ROW_HEIGHT_WITH_ORDERS
			: TASK_ROW_HEIGHT;

	const handleUnlink = async (orderId: Id<'projectOrders'>) => {
		try {
			await unlinkOrder({ orderId, orderTaskId: null });
		} catch {
			toastManager.add({ title: 'Could not unlink order', type: 'error' });
		}
	};

	return (
		<>
			<div
				className={`flex items-center justify-between border-border/50 border-b pr-3 ${dragHandleProps ? 'pl-6' : 'pl-8'}`}
				style={{ height: rowHeight }}
			>
				<div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
					<div className="flex min-w-0 items-center gap-1">
						{dragHandleProps && (
							<button
								aria-label="Drag to reorder task"
								className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
								type="button"
								{...dragHandleProps}
							>
								<GripVertical className="size-4" />
							</button>
						)}
						<button
							className="min-w-0 flex-1 truncate text-left text-sm hover:underline"
							onClick={onNameClick}
							type="button"
						>
							{task.name}
						</button>
					</div>
					{orderTask && ordersForTask && ordersForTask.length > 0 && (
						<div className="flex flex-wrap items-center gap-1 pl-1">
							{ordersForTask.map((order) => (
								<OrderBadge
									key={order._id}
									onUnlink={() => handleUnlink(order._id)}
									order={order}
								/>
							))}
						</div>
					)}
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<div className="flex items-center gap-2">
						{orderTask && (
							<Popover
								onOpenChange={setOrderPopoverOpen}
								open={orderPopoverOpen}
							>
								<PopoverTrigger
									nativeButton={false}
									render={
										<Badge
											className={`cursor-pointer ${getOrderBadgeClass(ordersForTask)}`}
											size="sm"
										/>
									}
								>
									{!ordersForTask || ordersForTask.length === 0
										? 'No Orders'
										: 'O'}
								</PopoverTrigger>
								<PopoverPopup side="top">
									<PopoverTitle>
										{orderTask.name} · {orderTask.durationDays}d
									</PopoverTitle>
								</PopoverPopup>
							</Popover>
						)}
						<span className="text-muted-foreground text-xs">
							{task.durationDays}d
						</span>
						<span
							className={`size-2 shrink-0 rounded-full ${{ Complete: 'bg-green-500', 'In Progress': 'bg-amber-400', Pending: 'bg-muted-foreground/40' }[task.status]}`}
						/>
					</div>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label="Task actions"
									size="icon-sm"
									type="button"
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical className="size-4" />
						</MenuTrigger>
						<MenuPopup align="end">
							{!orderTask && (
								<MenuItem onClick={() => setAddOrderTaskOpen(true)}>
									<ShoppingCart />
									Add Order Task
								</MenuItem>
							)}
							{orderTask && (
								<MenuItem onClick={() => setLinkOrdersOpen(true)}>
									<Link />
									Link Orders
								</MenuItem>
							)}
							{<MenuSeparator />}
							{task.status !== 'Pending' && (
								<MenuItem
									onClick={() =>
										updateStatus({ taskId: task._id, status: 'Pending' })
									}
								>
									Mark Pending
								</MenuItem>
							)}
							{task.status !== 'In Progress' && (
								<MenuItem
									onClick={() =>
										updateStatus({ taskId: task._id, status: 'In Progress' })
									}
								>
									Mark In Progress
								</MenuItem>
							)}
							{task.status !== 'Complete' && (
								<MenuItem
									onClick={() =>
										updateStatus({ taskId: task._id, status: 'Complete' })
									}
								>
									Mark Complete
								</MenuItem>
							)}
							<MenuSeparator />
							<MenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Edit Task
							</MenuItem>
							<MenuSeparator />
							{orderTask && (
								<MenuItem
									onClick={() => setDeleteOrderTaskOpen(true)}
									variant="destructive"
								>
									<Trash2 />
									Delete Order Task
								</MenuItem>
							)}
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Delete Task
							</MenuItem>
						</MenuPopup>
					</Menu>
				</div>
			</div>
			<EditProjectTask
				onOpenChange={setEditOpen}
				open={editOpen}
				stageStartDate={stageStartDate}
				stageTasks={stageTasks}
				task={task}
			/>
			<DeleteProjectTask
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				task={task}
			/>
			<AddProjectOrderTask
				onOpenChange={setAddOrderTaskOpen}
				open={addOrderTaskOpen}
				preselectedTaskId={task._id}
				projectId={task.projectId}
				stageId={task.stageId}
				stageTasks={stageTasks}
			/>
			{orderTask && (
				<>
					<DeleteProjectOrderTask
						onOpenChange={setDeleteOrderTaskOpen}
						open={deleteOrderTaskOpen}
						orderTask={orderTask}
					/>
					<LinkOrdersDialog
						onOpenChange={setLinkOrdersOpen}
						open={linkOrdersOpen}
						orderTask={orderTask}
					/>
				</>
			)}
		</>
	);
}
