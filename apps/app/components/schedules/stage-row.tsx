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
	ShoppingCart,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import AddOrderTask from './add-order-task';
import AddTask from './add-task';
import DeleteStage from './delete-stage';
import EditStage from './edit-stage';
import type { StageLayout } from './schedule-dependency-algorithm';
import { STAGE_ROW_HEIGHT } from './schedule-row-heights';

export default function StageRow({
	stage,
	stages,
	tasks,
	scheduleTemplateId,
	stageLayout,
	isCollapsed,
	onToggleCollapse,
	onNameClick,
	dragHandleProps,
}: {
	stage: Doc<'scheduleStages'>;
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	scheduleTemplateId: Id<'scheduleTemplates'>;
	stageLayout: StageLayout | undefined;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	onNameClick?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addTaskOpen, setAddTaskOpen] = useState(false);
	const [addOrderTaskOpen, setAddOrderTaskOpen] = useState(false);

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
						{tasks.length > 0 && stageLayout
							? stageLayout.endOffset - stageLayout.startOffset + 1
							: 1}
						d
					</span>
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
							<MenuItem onClick={() => setAddOrderTaskOpen(true)}>
								<ShoppingCart />
								Add Order Task
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
			<AddOrderTask
				onOpenChange={setAddOrderTaskOpen}
				open={addOrderTaskOpen}
				scheduleTemplateId={scheduleTemplateId}
				stageId={stage._id}
				stageTasks={tasks}
			/>
		</>
	);
}
