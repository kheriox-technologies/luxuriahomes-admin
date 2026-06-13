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
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteTask from './delete-task';
import EditTask from './edit-task';
import { TASK_ROW_HEIGHT } from './schedule-row-heights';

export default function TaskRow({
	task,
	tasks,
}: {
	task: Doc<'scheduleTasks'>;
	tasks: Doc<'scheduleTasks'>[];
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<div
				className="flex items-center justify-between border-border/50 border-b pr-3 pl-8"
				style={{ height: TASK_ROW_HEIGHT }}
			>
				<span className="truncate text-sm">{task.name}</span>
				<div className="flex shrink-0 items-center gap-1">
					<span className="text-muted-foreground text-xs">
						{task.durationDays}d
					</span>
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
			<EditTask
				onOpenChange={setEditOpen}
				open={editOpen}
				task={task}
				tasks={tasks}
			/>
			<DeleteTask onOpenChange={setDeleteOpen} open={deleteOpen} task={task} />
		</>
	);
}
