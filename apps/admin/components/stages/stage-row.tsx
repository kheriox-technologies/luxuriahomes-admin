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
import { EllipsisVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AddTask from '@/components/stages/add-task';
import DeleteStage from '@/components/stages/delete-stage';
import EditStage from '@/components/stages/edit-stage';

type Stage = Doc<'stages'>;

const ROW_HEIGHT = 40;

export default function StageRow({
	stage,
	allOrders,
}: {
	stage: Stage;
	allOrders: Doc<'orders'>[];
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addTaskOpen, setAddTaskOpen] = useState(false);

	return (
		<>
			<div
				className="flex items-center gap-2 border-b px-3"
				style={{ height: ROW_HEIGHT }}
			>
				<span className="min-w-0 flex-1 truncate font-semibold text-sm">
					{stage.name}
				</span>
				{stage.taskCount > 0 ? (
					<Badge className="shrink-0" size="sm" variant="outline">
						{stage.taskCount}
					</Badge>
				) : null}
				<Menu>
					<MenuTrigger
						render={
							<Button
								aria-label="Stage actions"
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
						<MenuItem onClick={() => setAddTaskOpen(true)}>
							<Plus />
							Add Task
						</MenuItem>
						<MenuSeparator />
						<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
							<Trash2 />
							Delete
						</MenuItem>
					</MenuPopup>
				</Menu>
			</div>

			<EditStage
				allOrders={allOrders}
				onOpenChange={setEditOpen}
				open={editOpen}
				stage={stage}
			/>

			<AddTask
				allOrders={allOrders}
				onOpenChange={setAddTaskOpen}
				open={addTaskOpen}
				stageId={stage._id}
			/>

			<DeleteStage
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				stageId={stage._id}
				stageName={stage.name}
			/>
		</>
	);
}
