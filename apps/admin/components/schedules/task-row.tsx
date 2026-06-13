'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Pencil, Trash2 } from 'lucide-react';
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
				<div className="flex min-w-0 flex-col">
					<span className="truncate text-sm">{task.name}</span>
					<span className="text-muted-foreground text-xs">
						{task.durationDays}d
					</span>
				</div>
				<Group>
					<Button
						aria-label="Edit task"
						onClick={() => setEditOpen(true)}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						<Pencil className="size-3.5" />
					</Button>
					<GroupSeparator />
					<Button
						aria-label="Delete task"
						onClick={() => setDeleteOpen(true)}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						<Trash2 className="size-3.5" />
					</Button>
				</Group>
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
