'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
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
import { useMutation } from 'convex/react';
import {
	EllipsisVertical,
	GripVertical,
	Pencil,
	ShoppingCart,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { TASK_ROW_HEIGHT } from '@/components/schedules/schedule-row-heights';
import AddProjectOrderTask from './add-project-order-task';
import DeleteProjectOrderTask from './delete-project-order-task';
import DeleteProjectTask from './delete-project-task';
import EditProjectTask from './edit-project-task';

export default function ProjectTaskRow({
	task,
	stageTasks,
	stageStartDate,
	orderTask,
	onNameClick,
	dragHandleProps,
}: {
	task: Doc<'projectTasks'>;
	stageTasks: Doc<'projectTasks'>[];
	stageStartDate: number;
	orderTask?: Doc<'projectOrderTasks'>;
	onNameClick?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addOrderTaskOpen, setAddOrderTaskOpen] = useState(false);
	const [deleteOrderTaskOpen, setDeleteOrderTaskOpen] = useState(false);
	const [orderPopoverOpen, setOrderPopoverOpen] = useState(false);
	const updateStatus = useMutation(api.projectTasks.updateStatus.updateStatus);

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
							{!orderTask && <MenuSeparator />}
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
				<DeleteProjectOrderTask
					onOpenChange={setDeleteOrderTaskOpen}
					open={deleteOrderTaskOpen}
					orderTask={orderTask}
				/>
			)}
		</>
	);
}
