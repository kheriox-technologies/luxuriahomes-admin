'use client';

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
	closestCorners,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import EditTask from '@/components/tasks/edit-task';
import SortableTaskCard, {
	TaskCardContent,
} from '@/components/tasks/task-card';
import {
	TASK_STATUS_BADGE_VARIANT,
	TASK_STATUS_LABELS,
	TASK_STATUS_ORDER,
	type TaskStatus,
} from '@/components/tasks/task-form-shared';
import TaskQuickAdd from '@/components/tasks/task-quick-add';

type Task = Doc<'tasks'>;

const LANE_PREFIX = 'lane-';

function Lane({
	status,
	tasks,
	composing,
	onStartAdd,
	onCloseAdd,
	children,
}: {
	status: TaskStatus;
	tasks: Task[];
	composing: boolean;
	onStartAdd: () => void;
	onCloseAdd: () => void;
	children: React.ReactNode;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: `${LANE_PREFIX}${status}`,
	});

	return (
		<Frame className="flex min-w-[260px] flex-1 flex-col">
			<FrameHeader className="flex flex-row items-center justify-between py-3">
				<FrameTitle className="leading-none">
					{TASK_STATUS_LABELS[status]}
				</FrameTitle>
				<Badge size="lg" variant={TASK_STATUS_BADGE_VARIANT[status]}>
					{tasks.length}
				</Badge>
			</FrameHeader>
			<FramePanel
				className={cn(
					'flex min-h-24 flex-1 flex-col gap-2 transition-colors',
					isOver ? 'bg-accent/40' : ''
				)}
				ref={setNodeRef}
			>
				{composing ? (
					<TaskQuickAdd onClose={onCloseAdd} status={status} />
				) : (
					<button
						className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed bg-background p-3 text-muted-foreground text-sm transition-colors hover:border-ring/60 hover:text-foreground"
						onClick={onStartAdd}
						type="button"
					>
						<Plus className="size-4" />
						Add task
					</button>
				)}
				{children}
			</FramePanel>
		</Frame>
	);
}

export default function TasksBoard({
	searchQuery,
	projectIds,
	assigneeIds,
}: {
	searchQuery: string;
	projectIds: string[];
	assigneeIds: string[];
}) {
	const tasks = useQuery(api.tasks.list.list, {});
	const projects = useQuery(api.projects.list.list, {});
	const admins = useQuery(api.adminUsers.list.list, {});
	// Optimistically move the card so it stays in the target lane immediately,
	// instead of snapping back until the server round-trip completes.
	const updateStatus = useMutation(
		api.tasks.updateStatus.updateStatus
	).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.tasks.list.list, {});
		if (!current) {
			return;
		}
		localStore.setQuery(
			api.tasks.list.list,
			{},
			current.map((task) =>
				task._id === args.taskId
					? { ...task, status: args.status, order: args.order }
					: task
			)
		);
	});

	const [activeId, setActiveId] = useState<Id<'tasks'> | null>(null);
	const [selectedTaskId, setSelectedTaskId] = useState<Id<'tasks'> | null>(
		null
	);
	const [composingStatus, setComposingStatus] = useState<TaskStatus | null>(
		null
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const projectNameById = useMemo(() => {
		const map = new Map<Id<'projects'>, string>();
		for (const p of projects ?? []) {
			map.set(p._id, p.name);
		}
		return map;
	}, [projects]);

	const assigneeNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const a of admins ?? []) {
			map.set(a.userId, a.fullName);
		}
		return map;
	}, [admins]);

	const filtered = useMemo(() => {
		const all = tasks ?? [];
		const q = searchQuery.trim().toLowerCase();
		const projectSet = new Set(projectIds);
		const assigneeSet = new Set(assigneeIds);
		return all.filter((t) => {
			if (q && !t.searchText.toLowerCase().includes(q)) {
				return false;
			}
			if (
				projectSet.size > 0 &&
				!(t.projectId && projectSet.has(t.projectId))
			) {
				return false;
			}
			if (
				assigneeSet.size > 0 &&
				!(t.assigneeUserId && assigneeSet.has(t.assigneeUserId))
			) {
				return false;
			}
			return true;
		});
	}, [tasks, searchQuery, projectIds, assigneeIds]);

	const tasksByStatus = useMemo(() => {
		const grouped: Record<TaskStatus, Task[]> = {
			planned: [],
			in_progress: [],
			blocked: [],
			done: [],
		};
		for (const task of filtered) {
			grouped[task.status].push(task);
		}
		// Sort each lane by due date ascending; tasks without a due date go last.
		for (const status of TASK_STATUS_ORDER) {
			grouped[status].sort((a, b) => {
				const aDue = a.dueDate ?? Number.POSITIVE_INFINITY;
				const bDue = b.dueDate ?? Number.POSITIVE_INFINITY;
				if (aDue !== bDue) {
					return aDue - bDue;
				}
				return a.order - b.order;
			});
		}
		return grouped;
	}, [filtered]);

	const taskById = useMemo(() => {
		const map = new Map<Id<'tasks'>, Task>();
		for (const t of tasks ?? []) {
			map.set(t._id, t);
		}
		return map;
	}, [tasks]);

	const activeTask = activeId ? taskById.get(activeId) : undefined;
	const selectedTask = selectedTaskId
		? taskById.get(selectedTaskId)
		: undefined;

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as Id<'tasks'>);
	};

	const onDragEnd = (event: DragEndEvent) => {
		setActiveId(null);
		const { active, over } = event;
		if (!over) {
			return;
		}
		const dragged = taskById.get(active.id as Id<'tasks'>);
		if (!dragged) {
			return;
		}

		const overId = String(over.id);
		let targetStatus: TaskStatus;
		if (overId.startsWith(LANE_PREFIX)) {
			targetStatus = overId.slice(LANE_PREFIX.length) as TaskStatus;
		} else {
			const overTask = taskById.get(over.id as Id<'tasks'>);
			if (!overTask) {
				return;
			}
			targetStatus = overTask.status;
		}

		// Target lane without the dragged card, in current order.
		const laneTasks = tasksByStatus[targetStatus].filter(
			(t) => t._id !== dragged._id
		);
		const insertIndex = overId.startsWith(LANE_PREFIX)
			? laneTasks.length
			: Math.max(
					0,
					laneTasks.findIndex((t) => t._id === over.id)
				);

		const prev = laneTasks[insertIndex - 1];
		const next = laneTasks[insertIndex];
		let newOrder: number;
		if (prev && next) {
			newOrder = (prev.order + next.order) / 2;
		} else if (prev) {
			newOrder = prev.order + 1;
		} else if (next) {
			newOrder = next.order - 1;
		} else {
			newOrder = 1;
		}

		if (targetStatus === dragged.status && newOrder === dragged.order) {
			return;
		}

		updateStatus({
			taskId: dragged._id,
			status: targetStatus,
			order: newOrder,
		}).catch(() => {
			/* Convex surfaces errors; board stays reactive */
		});
	};

	if (tasks === undefined) {
		return <p className="text-muted-foreground text-sm">Loading tasks…</p>;
	}

	return (
		<>
			<DndContext
				collisionDetection={closestCorners}
				onDragEnd={onDragEnd}
				onDragStart={onDragStart}
				sensors={sensors}
			>
				<div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
					{TASK_STATUS_ORDER.map((status) => {
						const laneTasks = tasksByStatus[status];
						return (
							<Lane
								composing={composingStatus === status}
								key={status}
								onCloseAdd={() => setComposingStatus(null)}
								onStartAdd={() => setComposingStatus(status)}
								status={status}
								tasks={laneTasks}
							>
								<SortableContext
									items={laneTasks.map((t) => t._id)}
									strategy={verticalListSortingStrategy}
								>
									{laneTasks.length === 0 ? (
										<p className="px-1 py-6 text-center text-muted-foreground text-xs">
											No tasks
										</p>
									) : (
										laneTasks.map((task) => (
											<SortableTaskCard
												assigneeName={
													task.assigneeUserId
														? assigneeNameById.get(task.assigneeUserId)
														: undefined
												}
												key={task._id}
												onOpen={() => setSelectedTaskId(task._id)}
												projectName={
													task.projectId
														? projectNameById.get(task.projectId)
														: undefined
												}
												task={task}
											/>
										))
									)}
								</SortableContext>
							</Lane>
						);
					})}
				</div>
				<DragOverlay>
					{activeTask ? (
						<TaskCardContent
							assigneeName={
								activeTask.assigneeUserId
									? assigneeNameById.get(activeTask.assigneeUserId)
									: undefined
							}
							dragging
							projectName={
								activeTask.projectId
									? projectNameById.get(activeTask.projectId)
									: undefined
							}
							task={activeTask}
						/>
					) : null}
				</DragOverlay>
			</DndContext>

			{selectedTask ? (
				<EditTask
					onOpenChange={(open) => {
						if (!open) {
							setSelectedTaskId(null);
						}
					}}
					open={selectedTaskId !== null}
					task={selectedTask}
				/>
			) : null}
		</>
	);
}
