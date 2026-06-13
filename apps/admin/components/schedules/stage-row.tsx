'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
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
import AddTask from './add-task';
import DeleteStage from './delete-stage';
import EditStage from './edit-stage';
import { STAGE_ROW_HEIGHT } from './schedule-row-heights';
import TaskRow from './task-row';

export default function StageRow({
	stage,
	stages,
	tasks,
	scheduleTemplateId,
}: {
	stage: Doc<'scheduleStages'>;
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	scheduleTemplateId: Id<'scheduleTemplates'>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addTaskOpen, setAddTaskOpen] = useState(false);

	return (
		<>
			<div
				className="flex items-center justify-between border-b bg-muted/40 px-3"
				style={{ height: STAGE_ROW_HEIGHT }}
			>
				<span className="truncate font-medium text-sm">{stage.name}</span>
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
						<MenuItem onClick={() => setAddTaskOpen(true)}>
							<Plus />
							Add Task
						</MenuItem>
						<MenuSeparator />
						<MenuItem onClick={() => setEditOpen(true)}>
							<Pencil />
							Edit Stage
						</MenuItem>
						<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
							<Trash2 />
							Delete Stage
						</MenuItem>
					</MenuPopup>
				</Menu>
			</div>
			{tasks.map((task) => (
				<TaskRow key={task._id} task={task} tasks={tasks} />
			))}
			<EditStage
				onOpenChange={setEditOpen}
				open={editOpen}
				stage={stage}
				stages={stages}
			/>
			<DeleteStage
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				stage={stage}
			/>
			<AddTask
				existingTasks={tasks}
				onOpenChange={setAddTaskOpen}
				open={addTaskOpen}
				scheduleTemplateId={scheduleTemplateId}
				stageId={stage._id}
			/>
		</>
	);
}
