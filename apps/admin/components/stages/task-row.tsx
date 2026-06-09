'use client';

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
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteTask from '@/components/stages/delete-task';
import EditTask from '@/components/stages/edit-task';

type Task = Doc<'tasks'>;

const ROW_HEIGHT = 42;

export default function TaskRow({
	task,
	allOrders,
}: {
	task: Task;
	allOrders: Doc<'orders'>[];
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<div
				className="flex items-center gap-2 border-b pr-3 pl-7"
				style={{ height: ROW_HEIGHT }}
			>
				<span className="min-w-0 flex-1 truncate text-sm">{task.name}</span>
				{task.duration > 0 ? (
					<Badge className="shrink-0" size="lg" variant="outline">
						{task.duration}d
					</Badge>
				) : null}
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
							Edit
						</MenuItem>
						<MenuSeparator />
						<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
							<Trash2 />
							Delete
						</MenuItem>
					</MenuPopup>
				</Menu>
			</div>

			<EditTask
				allOrders={allOrders}
				onOpenChange={setEditOpen}
				open={editOpen}
				task={task}
			/>

			<DeleteTask
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				taskId={task._id}
				taskName={task.name}
			/>
		</>
	);
}
