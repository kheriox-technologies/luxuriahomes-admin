'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { EllipsisVertical, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TASK_ROW_HEIGHT } from '@/components/schedules/schedule-row-heights';
import DeleteProjectTask from './delete-project-task';
import EditProjectTask from './edit-project-task';

export default function ProjectTaskRow({
	task,
	stageTasks,
	stageStartDate,
	onNameClick,
	dragHandleProps,
}: {
	task: Doc<'projectTasks'>;
	stageTasks: Doc<'projectTasks'>[];
	stageStartDate: number;
	onNameClick?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

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
					<span className="text-muted-foreground text-xs">
						{task.durationDays}d
					</span>
					<span
						className={`size-2 shrink-0 rounded-full ${{ Complete: 'bg-green-500', 'In Progress': 'bg-amber-400', Pending: 'bg-muted-foreground/40' }[task.status]}`}
					/>
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
							<MenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Edit Task
							</MenuItem>
							<MenuSeparator />
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
		</>
	);
}
