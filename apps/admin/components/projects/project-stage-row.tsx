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
import {
	ChevronDown,
	ChevronRight,
	EllipsisVertical,
	GripVertical,
	Pencil,
	Plus,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { STAGE_ROW_HEIGHT } from '@/components/schedules/schedule-row-heights';
import AddProjectTask from './add-project-task';
import DeleteProjectStage from './delete-project-stage';
import EditProjectStage from './edit-project-stage';

export default function ProjectStageRow({
	stage,
	stages,
	stageTasks,
	projectId,
	isCollapsed,
	onToggleCollapse,
	onNameClick,
	dragHandleProps,
}: {
	stage: Doc<'projectStages'>;
	stages: Doc<'projectStages'>[];
	stageTasks: Doc<'projectTasks'>[];
	projectId: Id<'projects'>;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	onNameClick?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
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
				<div className="flex min-w-0 flex-1 items-center gap-1">
					{dragHandleProps && (
						<button
							aria-label="Drag to reorder stage"
							className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
							type="button"
							{...dragHandleProps}
						>
							<GripVertical className="size-4" />
						</button>
					)}
					<Button
						aria-label={isCollapsed ? 'Expand stage' : 'Collapse stage'}
						onClick={onToggleCollapse}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						{isCollapsed ? (
							<ChevronRight className="size-4" />
						) : (
							<ChevronDown className="size-4" />
						)}
					</Button>
					<button
						className="min-w-0 flex-1 truncate text-left font-medium text-sm hover:underline"
						onClick={onNameClick}
						type="button"
					>
						{stage.name}
					</button>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<span className="text-muted-foreground text-xs">
						{stageTasks.length > 0
							? Math.round((stage.endDate - stage.startDate) / 86_400_000) + 1
							: 0}
						d
					</span>
					<span
						className={`size-2 shrink-0 rounded-full ${{ Complete: 'bg-green-500', 'In Progress': 'bg-amber-400', Pending: 'bg-muted-foreground/40' }[stage.status]}`}
					/>
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
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Delete Stage
							</MenuItem>
						</MenuPopup>
					</Menu>
				</div>
			</div>
			<EditProjectStage
				onOpenChange={setEditOpen}
				open={editOpen}
				stage={stage}
				stages={stages}
			/>
			<DeleteProjectStage
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				stage={stage}
			/>
			<AddProjectTask
				onOpenChange={setAddTaskOpen}
				open={addTaskOpen}
				projectId={projectId}
				stage={stage}
				stageTasks={stageTasks}
			/>
		</>
	);
}
