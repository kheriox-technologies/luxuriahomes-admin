'use client';

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
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
	EllipsisVertical,
	GripVertical,
	Pencil,
	ShoppingCart,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import AddOrderTask from './add-order-task';
import DeleteOrderTask from './delete-order-task';
import DeleteTask from './delete-task';
import EditTask from './edit-task';
import { TASK_ROW_HEIGHT } from './schedule-row-heights';

export default function TaskRow({
	task,
	tasks,
	scheduleTemplateId,
	orderTask,
	onNameClick,
	dragHandleProps,
}: {
	task: Doc<'scheduleTasks'>;
	tasks: Doc<'scheduleTasks'>[];
	scheduleTemplateId: Id<'scheduleTemplates'>;
	orderTask?: Doc<'scheduleOrderTasks'>;
	onNameClick?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addOrderTaskOpen, setAddOrderTaskOpen] = useState(false);
	const [deleteOrderTaskOpen, setDeleteOrderTaskOpen] = useState(false);
	const [orderPopoverOpen, setOrderPopoverOpen] = useState(false);

	return (
		<>
			<div
				className={`flex items-center justify-between border-border/50 border-b pr-3 ${dragHandleProps ? 'pl-6' : 'pl-8'}`}
				style={{ height: TASK_ROW_HEIGHT }}
			>
				<div className="flex min-w-0 flex-1 items-center gap-1">
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
				<div className="flex shrink-0 items-center gap-1">
					<div className="flex items-center gap-2">
						{orderTask && (
							<Popover
								onOpenChange={setOrderPopoverOpen}
								open={orderPopoverOpen}
							>
								<PopoverTrigger
									render={
										<Badge
											className="cursor-pointer bg-pink-500/20 px-1 py-0 font-semibold text-[9px] text-pink-700 dark:text-pink-300"
											size="sm"
										/>
									}
								>
									O
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
							{!orderTask && <MenuSeparator />}
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
			<EditTask
				onOpenChange={setEditOpen}
				open={editOpen}
				task={task}
				tasks={tasks}
			/>
			<DeleteTask onOpenChange={setDeleteOpen} open={deleteOpen} task={task} />
			<AddOrderTask
				onOpenChange={setAddOrderTaskOpen}
				open={addOrderTaskOpen}
				preselectedTaskId={task._id}
				scheduleTemplateId={scheduleTemplateId}
				stageId={task.stageId}
				stageTasks={tasks}
			/>
			{orderTask && (
				<DeleteOrderTask
					onOpenChange={setDeleteOrderTaskOpen}
					open={deleteOrderTaskOpen}
					orderTask={orderTask}
				/>
			)}
		</>
	);
}
