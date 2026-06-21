'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Doc } from '@workspace/backend/dataModel';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';
import { CalendarClock } from 'lucide-react';
import {
	formatDueDate,
	initialsFromName,
} from '@/components/tasks/task-form-shared';

interface TaskCardData {
	assigneeName?: string;
	projectName?: string;
	task: Doc<'tasks'>;
}

export function TaskCardContent({
	task,
	projectName,
	assigneeName,
	dragging,
}: TaskCardData & { dragging?: boolean }) {
	const overdue =
		task.dueDate !== undefined &&
		task.status !== 'done' &&
		task.dueDate < Date.now();

	return (
		<div
			className={cn(
				'flex flex-col gap-2 rounded-xl border bg-background p-3 shadow-xs/5 transition-shadow',
				dragging ? 'shadow-lg' : 'hover:border-ring/60'
			)}
		>
			<div className="flex items-start gap-2">
				<p className="line-clamp-2 min-w-0 flex-1 font-medium text-sm leading-snug">
					{task.title}
				</p>
				{assigneeName ? (
					<Avatar className="size-6 shrink-0" title={assigneeName}>
						<AvatarFallback className="text-[10px]">
							{initialsFromName(assigneeName)}
						</AvatarFallback>
					</Avatar>
				) : null}
			</div>

			{projectName || task.dueDate !== undefined ? (
				<div className="flex flex-wrap items-center gap-2">
					{projectName ? (
						<Badge size="lg" variant="secondary">
							{projectName}
						</Badge>
					) : null}
					{task.dueDate !== undefined ? (
						<Badge
							className={
								overdue
									? 'border-destructive/32 text-destructive-foreground'
									: undefined
							}
							size="lg"
							variant="outline"
						>
							<CalendarClock />
							{formatDueDate(task.dueDate)}
						</Badge>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export default function SortableTaskCard({
	task,
	projectName,
	assigneeName,
	onOpen,
}: TaskCardData & { onOpen: () => void }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task._id });

	return (
		<button
			className="w-full cursor-grab text-left active:cursor-grabbing"
			onClick={onOpen}
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
			type="button"
			{...attributes}
			{...listeners}
		>
			<TaskCardContent
				assigneeName={assigneeName}
				projectName={projectName}
				task={task}
			/>
		</button>
	);
}
