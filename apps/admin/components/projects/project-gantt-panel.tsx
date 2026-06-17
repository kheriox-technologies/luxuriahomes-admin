'use client';

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Label } from '@workspace/ui/components/label';
import {
	Popover,
	PopoverDescription,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { Switch } from '@workspace/ui/components/switch';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import {
	CalendarCheck,
	ChevronFirst,
	ChevronLast,
	ChevronsDownIcon,
	ChevronsUpIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import {
	STAGE_ROW_HEIGHT,
	TASK_ROW_HEIGHT,
} from '@/components/schedules/schedule-row-heights';
import {
	addBusinessDays,
	addCalendarDays,
	countBusinessDaysBetween,
	dateToCalOffset,
	formatProjectDate,
	startOfDay,
} from './project-schedule-date-utils';
import ProjectStageRow from './project-stage-row';
import ProjectTaskRow from './project-task-row';

const DAY_WIDTH = 50;
const DATE_HEADER_HEIGHT = 52;
const MIN_DAYS = 20;
const STAGE_LIST_WIDTH = 280;
const GRID_LEFT_PADDING = 24;

interface ProjectGanttColumn {
	date: Date;
	dayIndex: number;
	dayLabel: string;
	dayName: string;
	isToday: boolean;
	isWeekend: boolean;
	monthLabel: string;
	widthDays: number;
}

interface ArrowDef {
	dependentStageId?: Id<'projectStages'>;
	dependentTaskId?: Id<'projectTasks'>;
	depType: 'startAfter' | 'startWith';
	fromName: string;
	fromX: number;
	fromY: number;
	itemType: 'task' | 'stage';
	key: string;
	toName: string;
	toX: number;
	toY: number;
}

function buildArrowPath(
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	depType: 'startAfter' | 'startWith'
): string {
	const JOG = 20;
	const CORNER_R = 4;

	if (depType === 'startWith') {
		const midX = Math.min(fromX, toX) - JOG;
		const dy = toY >= fromY ? 1 : -1;
		const r = Math.min(CORNER_R, Math.abs(toY - fromY) / 2);
		if (r < 1) {
			return `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`;
		}
		return [
			`M ${fromX} ${fromY}`,
			`H ${midX + r}`,
			`Q ${midX} ${fromY} ${midX} ${fromY + dy * r}`,
			`V ${toY - dy * r}`,
			`Q ${midX} ${toY} ${midX + r} ${toY}`,
			`H ${toX}`,
		].join(' ');
	}

	const midXr = fromX + JOG;
	const midXl = toX - JOG;
	const dy = toY >= fromY ? 1 : -1;
	const midY = toY - dy * JOG;
	const dxH = midXl >= midXr ? 1 : -1;
	const vertSpan = Math.abs(toY - fromY);
	const horizSpan = Math.abs(midXl - midXr);

	if (vertSpan < 4 || horizSpan < 2) {
		return `M ${fromX} ${fromY} H ${midXr} V ${toY} H ${toX}`;
	}

	const r = Math.min(
		CORNER_R,
		Math.abs(midY - fromY) / 2,
		JOG / 2,
		horizSpan / 2
	);
	return [
		`M ${fromX} ${fromY}`,
		`H ${midXr - r}`,
		`Q ${midXr} ${fromY} ${midXr} ${fromY + dy * r}`,
		`V ${midY - dy * r}`,
		`Q ${midXr} ${midY} ${midXr + dxH * r} ${midY}`,
		`H ${midXl - dxH * r}`,
		`Q ${midXl} ${midY} ${midXl} ${midY + dy * r}`,
		`V ${toY - dy * r}`,
		`Q ${midXl} ${toY} ${midXl + r} ${toY}`,
		`H ${toX}`,
	].join(' ');
}

function getStageBarColor(status: Doc<'projectStages'>['status']): string {
	switch (status) {
		case 'In Progress':
			return 'bg-amber-500/70';
		case 'Complete':
			return 'bg-green-600/70';
		default:
			return 'bg-purple-500/70';
	}
}

function getTaskBarColor(status: Doc<'projectTasks'>['status']): string {
	switch (status) {
		case 'In Progress':
			return 'bg-amber-400/70';
		case 'Complete':
			return 'bg-green-500/70';
		default:
			return 'bg-blue-500/70';
	}
}

function getStatusVariant(status: string): 'warning' | 'success' | 'secondary' {
	if (status === 'In Progress') {
		return 'warning';
	}
	if (status === 'Complete') {
		return 'success';
	}
	return 'secondary';
}

function StatusBadge({ status }: { status: string }) {
	return (
		<Badge size="lg" variant={getStatusVariant(status)}>
			{status}
		</Badge>
	);
}

function SortableProjectStageWrapper({
	stage,
	isDndEnabled,
	children,
	...rowProps
}: {
	stage: Doc<'projectStages'>;
	isDndEnabled: boolean;
	children: React.ReactNode;
} & Omit<
	React.ComponentProps<typeof ProjectStageRow>,
	'stage' | 'dragHandleProps'
>) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: stage._id, disabled: !isDndEnabled });
	const style = transform
		? {
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : undefined,
			}
		: undefined;
	return (
		<div ref={setNodeRef} style={style}>
			<ProjectStageRow
				{...rowProps}
				dragHandleProps={
					isDndEnabled ? { ...attributes, ...listeners } : undefined
				}
				stage={stage}
			/>
			{children}
		</div>
	);
}

function SortableProjectTaskWrapper({
	task,
	isDndEnabled,
	...rowProps
}: {
	task: Doc<'projectTasks'>;
	isDndEnabled: boolean;
} & Omit<
	React.ComponentProps<typeof ProjectTaskRow>,
	'task' | 'dragHandleProps'
>) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task._id, disabled: !isDndEnabled });
	const style = transform
		? {
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : undefined,
			}
		: undefined;
	return (
		<div ref={setNodeRef} style={style}>
			<ProjectTaskRow
				{...rowProps}
				dragHandleProps={
					isDndEnabled ? { ...attributes, ...listeners } : undefined
				}
				task={task}
			/>
		</div>
	);
}

function DragOverlayContent({
	activeId,
	stages,
	tasks,
}: {
	activeId: string;
	stages: Doc<'projectStages'>[];
	tasks: Doc<'projectTasks'>[];
}) {
	const stage = stages.find((s) => s._id === activeId);
	if (stage) {
		return (
			<div
				className="flex cursor-grabbing items-center border-b bg-muted/40 px-3 font-medium text-sm shadow-md"
				style={{ height: STAGE_ROW_HEIGHT }}
			>
				{stage.name}
			</div>
		);
	}
	const task = tasks.find((t) => t._id === activeId);
	if (task) {
		return (
			<div
				className="flex cursor-grabbing items-center border-b bg-background pl-8 text-sm shadow-md"
				style={{ height: TASK_ROW_HEIGHT }}
			>
				{task.name}
			</div>
		);
	}
	return null;
}

export default function ProjectGanttPanel({
	projectId,
	projectStartDate,
	stages,
	tasks,
	search,
}: {
	projectId: Id<'projects'>;
	projectStartDate: number;
	stages: Doc<'projectStages'>[];
	tasks: Doc<'projectTasks'>[];
	search?: string;
}) {
	const [isReadOnly, setIsReadOnly] = useState(true);
	const [collapsedStages, setCollapsedStages] = useState<Set<string>>(
		new Set()
	);
	const [deletingArrow, setDeletingArrow] = useState<ArrowDef | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [leftPanelWidth, setLeftPanelWidth] = useState(STAGE_LIST_WIDTH);
	const isPanelResizing = useRef(false);
	const dragStartX = useRef(0);
	const dragStartWidth = useRef(0);

	const clearTaskDependency = useMutation(
		api.projectTasks.clearDependency.clearDependency
	);
	const clearStageDependency = useMutation(
		api.projectStages.clearDependency.clearDependency
	);
	const updateTaskDates = useMutation(api.projectTasks.updateDates.updateDates);
	const updateStageDates = useMutation(
		api.projectStages.updateDates.updateDates
	);
	const reorderStages = useMutation(api.projectStages.reorder.reorder);
	const reorderTasks = useMutation(api.projectTasks.reorder.reorder);
	const updateTaskStatus = useMutation(
		api.projectTasks.updateStatus.updateStatus
	);
	const updateStageStatus = useMutation(
		api.projectStages.updateStatus.updateStatus
	);

	const [activeDragId, setActiveDragId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const [resizePreview, setResizePreview] = useState<{
		taskId: string;
		durationDays: number;
	} | null>(null);
	const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
	const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('day');
	const [stageReversionTicks, setStageReversionTicks] = useState<
		Map<string, number>
	>(new Map());
	const [taskReversionTicks, setTaskReversionTicks] = useState<
		Map<string, number>
	>(new Map());

	const leftRef = useRef<HTMLDivElement>(null);
	const rightRef = useRef<HTMLDivElement>(null);
	const isSyncing = useRef(false);

	const today = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	// Anchor date: earliest stage start minus 3 days padding
	const anchor = useMemo(() => {
		const allStartDates = stages.map((s) => s.startDate);
		const minDate =
			allStartDates.length > 0 ? Math.min(...allStartDates) : projectStartDate;
		const anchorRaw = startOfDay(new Date(Math.min(minDate, today.getTime())));
		return addCalendarDays(anchorRaw, -3);
	}, [stages, today, projectStartDate]);

	// Total calendar days to show
	const totalDays = useMemo(() => {
		let maxOffset = MIN_DAYS;
		for (const stage of stages) {
			const endOff = dateToCalOffset(new Date(stage.endDate), anchor) + 1;
			if (endOff > maxOffset) {
				maxOffset = endOff;
			}
		}
		for (const task of tasks) {
			const endOff = dateToCalOffset(new Date(task.endDate), anchor) + 1;
			if (endOff > maxOffset) {
				maxOffset = endOff;
			}
		}
		// Always show at least 30 days past today
		const todayOff = dateToCalOffset(today, anchor) + 30;
		if (todayOff > maxOffset) {
			maxOffset = todayOff;
		}
		return Math.max(maxOffset + 5, MIN_DAYS);
	}, [stages, tasks, anchor, today]);

	let pixelsPerDay = DAY_WIDTH;
	if (viewType === 'week') {
		pixelsPerDay = 15;
	} else if (viewType === 'month') {
		pixelsPerDay = 5;
	}
	const gridWidth = GRID_LEFT_PADDING + totalDays * pixelsPerDay;

	const dayColumns = useMemo<ProjectGanttColumn[]>(() => {
		const todayStr = today.toDateString();
		return Array.from({ length: totalDays }, (_, i) => {
			const date = addCalendarDays(anchor, i);
			const dow = date.getDay();
			return {
				date,
				dayIndex: i,
				isWeekend: dow === 0 || dow === 6,
				isToday: date.toDateString() === todayStr,
				dayLabel: date.toLocaleDateString('en-AU', { day: 'numeric' }),
				monthLabel: date.toLocaleDateString('en-AU', { month: 'short' }),
				dayName: date.toLocaleDateString('en-AU', { weekday: 'short' }),
				widthDays: 1,
			};
		});
	}, [anchor, totalDays, today]);

	const headerColumns = useMemo<ProjectGanttColumn[]>(() => {
		if (viewType === 'day') {
			return dayColumns;
		}
		const todayOffset = dateToCalOffset(today, anchor);
		if (viewType === 'week') {
			const anchorDow = anchor.getDay();
			const daysToMon = -((anchorDow + 6) % 7);
			const cols: ProjectGanttColumn[] = [];
			let dayIndex = daysToMon;
			while (dayIndex < totalDays) {
				const startDate = addCalendarDays(anchor, dayIndex);
				const endDate = addCalendarDays(anchor, dayIndex + 6);
				const containsToday =
					todayOffset >= dayIndex && todayOffset < dayIndex + 7;
				cols.push({
					date: startDate,
					dayIndex,
					dayLabel: startDate.toLocaleDateString('en-AU', {
						day: 'numeric',
						month: 'short',
					}),
					dayName: '',
					isToday: containsToday,
					isWeekend: false,
					monthLabel: endDate.toLocaleDateString('en-AU', {
						day: 'numeric',
						month: 'short',
					}),
					widthDays: 7,
				});
				dayIndex += 7;
			}
			return cols;
		}
		// month view
		const daysTillFirst = 1 - anchor.getDate();
		const cols: ProjectGanttColumn[] = [];
		let dayIndex = daysTillFirst;
		while (dayIndex < totalDays) {
			const monthStart = addCalendarDays(anchor, dayIndex);
			const daysInMonth = new Date(
				monthStart.getFullYear(),
				monthStart.getMonth() + 1,
				0
			).getDate();
			const containsToday =
				todayOffset >= dayIndex && todayOffset < dayIndex + daysInMonth;
			cols.push({
				date: monthStart,
				dayIndex,
				dayLabel: monthStart.toLocaleDateString('en-AU', { month: 'long' }),
				dayName: '',
				isToday: containsToday,
				isWeekend: false,
				monthLabel: String(monthStart.getFullYear()),
				widthDays: daysInMonth,
			});
			dayIndex += daysInMonth;
		}
		return cols;
	}, [viewType, dayColumns, anchor, today, totalDays]);

	const onLeftScroll = useCallback(() => {
		if (isSyncing.current || !rightRef.current || !leftRef.current) {
			return;
		}
		isSyncing.current = true;
		rightRef.current.scrollTop = leftRef.current.scrollTop;
		isSyncing.current = false;
	}, []);

	const onRightScroll = useCallback(() => {
		if (isSyncing.current || !leftRef.current || !rightRef.current) {
			return;
		}
		isSyncing.current = true;
		leftRef.current.scrollTop = rightRef.current.scrollTop;
		isSyncing.current = false;
	}, []);

	const toggleStage = useCallback((stageId: string) => {
		setCollapsedStages((prev) => {
			const next = new Set(prev);
			if (next.has(stageId)) {
				next.delete(stageId);
			} else {
				next.add(stageId);
			}
			return next;
		});
	}, []);

	const expandAll = useCallback(() => setCollapsedStages(new Set()), []);
	const collapseAll = useCallback(
		() => setCollapsedStages(new Set(stages.map((s) => s._id))),
		[stages]
	);

	const scrollToToday = useCallback(() => {
		if (!rightRef.current) {
			return;
		}
		const todayOffset = dateToCalOffset(today, anchor);
		const containerWidth = rightRef.current.clientWidth;
		const scrollLeft =
			GRID_LEFT_PADDING + todayOffset * pixelsPerDay - containerWidth / 2;
		rightRef.current.scrollTo({
			left: Math.max(0, scrollLeft),
			behavior: 'smooth',
		});
	}, [today, anchor, pixelsPerDay]);

	const scrollToStart = useCallback(() => {
		if (!rightRef.current || stages.length === 0) {
			return;
		}
		const minStart = Math.min(...stages.map((s) => s.startDate));
		const offset = dateToCalOffset(new Date(minStart), anchor);
		rightRef.current.scrollTo({
			left: Math.max(0, GRID_LEFT_PADDING + offset * pixelsPerDay - 24),
			behavior: 'smooth',
		});
	}, [stages, anchor, pixelsPerDay]);

	const scrollToEnd = useCallback(() => {
		if (!rightRef.current || stages.length === 0) {
			return;
		}
		const maxEnd = Math.max(...stages.map((s) => s.endDate));
		const offset = dateToCalOffset(new Date(maxEnd), anchor);
		const containerWidth = rightRef.current.clientWidth;
		rightRef.current.scrollTo({
			left: Math.max(
				0,
				GRID_LEFT_PADDING + (offset + 1) * pixelsPerDay - containerWidth + 24
			),
			behavior: 'smooth',
		});
	}, [stages, anchor, pixelsPerDay]);

	const onResizeMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			isPanelResizing.current = true;
			dragStartX.current = e.clientX;
			dragStartWidth.current = leftPanelWidth;
		},
		[leftPanelWidth]
	);

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (isPanelResizing.current) {
				const delta = e.clientX - dragStartX.current;
				setLeftPanelWidth(
					Math.max(STAGE_LIST_WIDTH, dragStartWidth.current + delta)
				);
			}
		};
		const onMouseUp = () => {
			isPanelResizing.current = false;
		};
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, []);

	const tasksByStage = useMemo(() => {
		const map = new Map<string, Doc<'projectTasks'>[]>();
		for (const stage of stages) {
			map.set(stage._id, []);
		}
		for (const task of tasks) {
			const list = map.get(task.stageId);
			if (list) {
				list.push(task);
			}
		}
		return map;
	}, [stages, tasks]);

	const stageIdSet = useMemo(
		() => new Set(stages.map((s) => s._id as string)),
		[stages]
	);

	const taskStageMap = useMemo(() => {
		const map = new Map<string, string>();
		for (const task of tasks) {
			map.set(task._id as string, task.stageId as string);
		}
		return map;
	}, [tasks]);

	const isDndEnabled = !(isReadOnly || search);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveDragId(event.active.id as string);
	}, []);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			setActiveDragId(null);
			const { active, over } = event;
			if (!over || active.id === over.id) {
				return;
			}
			const activeId = active.id as string;
			const overId = over.id as string;

			if (stageIdSet.has(activeId)) {
				const oldIndex = stages.findIndex((s) => s._id === activeId);
				const newIndex = stages.findIndex((s) => s._id === overId);
				if (oldIndex === -1 || newIndex === -1) {
					return;
				}
				const reordered = arrayMove(stages, oldIndex, newIndex);
				reorderStages({
					projectId,
					stageIds: reordered.map((s) => s._id),
				});
			} else {
				const stageId = taskStageMap.get(activeId);
				if (!stageId) {
					return;
				}
				const stageTasks = tasksByStage.get(stageId) ?? [];
				const oldIndex = stageTasks.findIndex((t) => t._id === activeId);
				const newIndex = stageTasks.findIndex((t) => t._id === overId);
				if (oldIndex === -1 || newIndex === -1) {
					return;
				}
				const reordered = arrayMove(stageTasks, oldIndex, newIndex);
				reorderTasks({
					stageId: stageId as Id<'projectStages'>,
					taskIds: reordered.map((t) => t._id),
				});
			}
		},
		[
			stages,
			stageIdSet,
			taskStageMap,
			tasksByStage,
			projectId,
			reorderStages,
			reorderTasks,
		]
	);

	const { displayedStages, getDisplayedTasks, forceExpandedStageIds } =
		useMemo(() => {
			const lowerSearch = search?.toLowerCase() ?? '';
			if (!lowerSearch) {
				return {
					displayedStages: stages,
					getDisplayedTasks: (stageId: string) =>
						tasksByStage.get(stageId) ?? [],
					forceExpandedStageIds: new Set<string>(),
				};
			}
			const matches = (name: string) =>
				name.toLowerCase().includes(lowerSearch);
			const forceExpanded = new Set<string>();
			const filteredData: Array<{
				stage: Doc<'projectStages'>;
				tasks: Doc<'projectTasks'>[];
			}> = [];
			for (const stage of stages) {
				const allTasks = tasksByStage.get(stage._id) ?? [];
				const stageNameMatches = matches(stage.name);
				const matchingTasks = allTasks.filter((t) => matches(t.name));
				if (!stageNameMatches && matchingTasks.length === 0) {
					continue;
				}
				filteredData.push({
					stage,
					tasks: stageNameMatches ? allTasks : matchingTasks,
				});
				if (matchingTasks.length > 0) {
					forceExpanded.add(stage._id);
				}
			}
			const stageDataMap = new Map<string, Doc<'projectTasks'>[]>(
				filteredData.map(({ stage, tasks: t }) => [stage._id, t])
			);
			return {
				displayedStages: filteredData.map(({ stage }) => stage),
				getDisplayedTasks: (stageId: string) => stageDataMap.get(stageId) ?? [],
				forceExpandedStageIds: forceExpanded,
			};
		}, [search, stages, tasksByStage]);

	const isExpanded = useCallback(
		(stageId: string) =>
			forceExpandedStageIds.has(stageId) || !collapsedStages.has(stageId),
		[forceExpandedStageIds, collapsedStages]
	);

	const rowYMap = useMemo(() => {
		const map = new Map<string, number>();
		let y = 0;
		for (const stage of displayedStages) {
			map.set(stage._id, y + STAGE_ROW_HEIGHT / 2);
			y += STAGE_ROW_HEIGHT;
			if (isExpanded(stage._id)) {
				for (const task of getDisplayedTasks(stage._id)) {
					map.set(task._id, y + TASK_ROW_HEIGHT / 2);
					y += TASK_ROW_HEIGHT;
				}
			}
		}
		return map;
	}, [displayedStages, getDisplayedTasks, isExpanded]);

	const totalRowHeight = useMemo(() => {
		let h = 0;
		for (const stage of displayedStages) {
			h += STAGE_ROW_HEIGHT;
			if (isExpanded(stage._id)) {
				h += getDisplayedTasks(stage._id).length * TASK_ROW_HEIGHT;
			}
		}
		return h;
	}, [displayedStages, getDisplayedTasks, isExpanded]);

	const arrows = useMemo<ArrowDef[]>(() => {
		const result: ArrowDef[] = [];
		const taskNameMap = new Map(tasks.map((t) => [t._id, t.name]));
		const stageNameMap = new Map(stages.map((s) => [s._id, s.name]));
		const taskMap = new Map(tasks.map((t) => [t._id, t]));
		const stageMap = new Map(stages.map((s) => [s._id, s]));

		for (const task of tasks) {
			if (!(task.dependencyTaskId && task.dependencyType)) {
				continue;
			}
			const depTask = taskMap.get(task.dependencyTaskId);
			if (!depTask) {
				continue;
			}
			const fromY = rowYMap.get(task.dependencyTaskId);
			const toY = rowYMap.get(task._id);
			if (fromY === undefined || toY === undefined) {
				continue;
			}

			const fromX =
				task.dependencyType === 'startAfter'
					? GRID_LEFT_PADDING +
						(dateToCalOffset(new Date(depTask.endDate), anchor) + 1) *
							pixelsPerDay
					: GRID_LEFT_PADDING +
						dateToCalOffset(new Date(depTask.startDate), anchor) * pixelsPerDay;
			const toX =
				GRID_LEFT_PADDING +
				dateToCalOffset(new Date(task.startDate), anchor) * pixelsPerDay;

			result.push({
				key: `task-${task._id}`,
				fromX,
				fromY,
				toX,
				toY,
				depType: task.dependencyType,
				fromName: taskNameMap.get(task.dependencyTaskId) ?? '',
				toName: task.name,
				itemType: 'task',
				dependentTaskId: task._id,
			});
		}

		for (const stage of stages) {
			if (!(stage.dependencyStageId && stage.dependencyType)) {
				continue;
			}
			const depStage = stageMap.get(stage.dependencyStageId);
			if (!depStage) {
				continue;
			}
			const fromY = rowYMap.get(stage.dependencyStageId);
			const toY = rowYMap.get(stage._id);
			if (fromY === undefined || toY === undefined) {
				continue;
			}

			const fromX =
				stage.dependencyType === 'startAfter'
					? GRID_LEFT_PADDING +
						(dateToCalOffset(new Date(depStage.endDate), anchor) + 1) *
							pixelsPerDay
					: GRID_LEFT_PADDING +
						dateToCalOffset(new Date(depStage.startDate), anchor) *
							pixelsPerDay;
			const toX =
				GRID_LEFT_PADDING +
				dateToCalOffset(new Date(stage.startDate), anchor) * pixelsPerDay;

			result.push({
				key: `stage-${stage._id}`,
				fromX,
				fromY,
				toX,
				toY,
				depType: stage.dependencyType,
				fromName: stageNameMap.get(stage.dependencyStageId) ?? '',
				toName: stage.name,
				itemType: 'stage',
				dependentStageId: stage._id,
			});
		}

		return result;
	}, [tasks, stages, rowYMap, anchor, pixelsPerDay]);

	const scrollToDate = useCallback(
		(timestamp: number) => {
			if (!rightRef.current) {
				return;
			}
			const offset = dateToCalOffset(new Date(timestamp), anchor);
			const containerWidth = rightRef.current.clientWidth;
			rightRef.current.scrollTo({
				left: Math.max(
					0,
					GRID_LEFT_PADDING + offset * pixelsPerDay - containerWidth / 2
				),
				behavior: 'smooth',
			});
		},
		[anchor, pixelsPerDay]
	);

	const onDeleteDependency = useCallback(async () => {
		if (!deletingArrow) {
			return;
		}
		setIsDeleting(true);
		try {
			if (deletingArrow.itemType === 'task' && deletingArrow.dependentTaskId) {
				await clearTaskDependency({ taskId: deletingArrow.dependentTaskId });
			} else if (deletingArrow.dependentStageId) {
				await clearStageDependency({
					stageId: deletingArrow.dependentStageId,
				});
			}
			setDeletingArrow(null);
		} catch {
			toastManager.add({
				title: 'Could not remove dependency',
				description: 'Please try again in a moment.',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	}, [deletingArrow, clearTaskDependency, clearStageDependency]);

	if (stages.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center p-6">
				<p className="text-center text-muted-foreground text-sm">
					No stages yet. Apply a schedule template or add a stage to get
					started.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				{/* Toolbar */}
				<div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
					<div className="flex items-center gap-2">
						<Switch
							checked={isReadOnly}
							id="project-read-only-toggle"
							onCheckedChange={setIsReadOnly}
						/>
						<Label htmlFor="project-read-only-toggle">Read Only</Label>
					</div>
					<div className="flex items-center gap-2">
						<Group>
							<Button
								className={viewType === 'day' ? 'bg-secondary' : undefined}
								onClick={() => setViewType('day')}
								size="sm"
								type="button"
								variant="outline"
							>
								Day
							</Button>
							<GroupSeparator />
							<Button
								className={viewType === 'week' ? 'bg-secondary' : undefined}
								onClick={() => setViewType('week')}
								size="sm"
								type="button"
								variant="outline"
							>
								Week
							</Button>
							<GroupSeparator />
							<Button
								className={viewType === 'month' ? 'bg-secondary' : undefined}
								onClick={() => setViewType('month')}
								size="sm"
								type="button"
								variant="outline"
							>
								Month
							</Button>
						</Group>
						<Group>
							<Button
								aria-label="Scroll to start"
								onClick={scrollToStart}
								size="sm"
								type="button"
								variant="outline"
							>
								<ChevronFirst />
							</Button>
							<GroupSeparator />
							<Button
								onClick={scrollToToday}
								size="sm"
								type="button"
								variant="outline"
							>
								<CalendarCheck />
								Today
							</Button>
							<GroupSeparator />
							<Button
								aria-label="Scroll to end"
								onClick={scrollToEnd}
								size="sm"
								type="button"
								variant="outline"
							>
								<ChevronLast />
							</Button>
						</Group>
						<Button
							onClick={expandAll}
							size="sm"
							type="button"
							variant="outline"
						>
							<ChevronsDownIcon />
							Expand All
						</Button>
						<Button
							onClick={collapseAll}
							size="sm"
							type="button"
							variant="outline"
						>
							<ChevronsUpIcon />
							Collapse All
						</Button>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 overflow-hidden">
					{/* Left panel */}
					<div
						className="shrink-0 overflow-y-auto overflow-x-hidden bg-background [&::-webkit-scrollbar]:hidden"
						onScroll={onLeftScroll}
						ref={leftRef}
						style={{ scrollbarWidth: 'none', width: leftPanelWidth }}
					>
						<div
							className="sticky top-0 z-10 border-b bg-background"
							style={{ height: DATE_HEADER_HEIGHT }}
						/>
						<DndContext
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							sensors={sensors}
						>
							<SortableContext
								items={isDndEnabled ? displayedStages.map((s) => s._id) : []}
								strategy={verticalListSortingStrategy}
							>
								{displayedStages.map((stage) => {
									const stageTasks = getDisplayedTasks(stage._id);
									return (
										<SortableProjectStageWrapper
											isCollapsed={!isExpanded(stage._id)}
											isDndEnabled={isDndEnabled}
											key={stage._id}
											onNameClick={() => {
												scrollToDate(stage.startDate);
												setTimeout(() => setOpenPopoverId(stage._id), 400);
											}}
											onToggleCollapse={() => toggleStage(stage._id)}
											projectId={projectId}
											stage={stage}
											stages={stages}
											stageTasks={stageTasks}
										>
											<SortableContext
												items={isDndEnabled ? stageTasks.map((t) => t._id) : []}
												strategy={verticalListSortingStrategy}
											>
												{isExpanded(stage._id) &&
													stageTasks.map((task) => (
														<SortableProjectTaskWrapper
															isDndEnabled={isDndEnabled}
															key={task._id}
															onNameClick={() => {
																scrollToDate(task.startDate);
																setTimeout(
																	() => setOpenPopoverId(task._id),
																	400
																);
															}}
															stageStartDate={stage.startDate}
															stageTasks={stageTasks}
															task={task}
														/>
													))}
											</SortableContext>
										</SortableProjectStageWrapper>
									);
								})}
							</SortableContext>
							<DragOverlay>
								{activeDragId ? (
									<DragOverlayContent
										activeId={activeDragId}
										stages={stages}
										tasks={tasks}
									/>
								) : null}
							</DragOverlay>
						</DndContext>
					</div>

					{/* Resize handle */}
					<button
						aria-label="Resize panel"
						className="group relative z-20 w-px shrink-0 cursor-col-resize border-r bg-transparent p-0"
						onMouseDown={onResizeMouseDown}
						type="button"
					>
						<span className="absolute inset-y-0 -right-1 -left-1 group-hover:bg-primary/20" />
					</button>

					{/* Right panel — grid */}
					<div
						className="min-w-0 flex-1 overflow-auto"
						onScroll={onRightScroll}
						ref={rightRef}
					>
						<div className="relative" style={{ width: gridWidth }}>
							{/* Date header */}
							<div
								className="sticky top-0 z-10 border-b bg-background"
								style={{ height: DATE_HEADER_HEIGHT }}
							>
								{headerColumns.map((col) => (
									<div
										className={`absolute inset-y-0 flex flex-col items-center justify-center gap-0.5 border-r text-muted-foreground text-xs ${col.isToday ? 'bg-primary/10 font-semibold text-primary' : ''}`}
										key={col.dayIndex}
										style={{
											left: GRID_LEFT_PADDING + col.dayIndex * pixelsPerDay,
											width: col.widthDays * pixelsPerDay,
										}}
									>
										{col.dayName && (
											<span className="text-[10px] leading-none opacity-60">
												{col.dayName}
											</span>
										)}
										<span className="font-medium leading-none">
											{col.dayLabel}
										</span>
										{col.monthLabel && (
											<span className="text-[10px] leading-none opacity-70">
												{col.monthLabel}
											</span>
										)}
									</div>
								))}
							</div>

							{/* Grid rows */}
							{displayedStages.map((stage, stageIndex) => {
								const stageTasks = getDisplayedTasks(stage._id);
								const isEven = stageIndex % 2 === 0;

								const stageStartOff = dateToCalOffset(
									new Date(stage.startDate),
									anchor
								);
								const stageEndOff = dateToCalOffset(
									new Date(stage.endDate),
									anchor
								);
								const stageBarLeft =
									GRID_LEFT_PADDING + stageStartOff * pixelsPerDay;
								const stageBarWidth = Math.max(
									pixelsPerDay,
									(stageEndOff - stageStartOff + 1) * pixelsPerDay
								);
								const stageBarColor = getStageBarColor(stage.status);

								return (
									<div key={stage._id}>
										{/* Stage row */}
										<div
											className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
											style={{ height: STAGE_ROW_HEIGHT, width: gridWidth }}
										>
											{viewType === 'day' &&
												dayColumns
													.filter((col) => col.isWeekend)
													.map((col) => (
														<div
															className="absolute inset-y-0 bg-foreground/5"
															key={col.dayIndex}
															style={{
																left:
																	GRID_LEFT_PADDING +
																	col.dayIndex * pixelsPerDay,
																width: pixelsPerDay,
															}}
														/>
													))}
											{headerColumns.map((col) => (
												<div
													className={`absolute inset-y-0 border-border/40 border-r${col.isToday ? 'bg-primary/10' : ''}`}
													key={col.dayIndex}
													style={{
														left:
															GRID_LEFT_PADDING + col.dayIndex * pixelsPerDay,
														width: col.widthDays * pixelsPerDay,
													}}
												/>
											))}
											{stage.endDate >= stage.startDate ? (
												<>
													<Rnd
														default={{
															x: stageBarLeft,
															y: STAGE_ROW_HEIGHT / 2 - 8,
															width: stageBarWidth,
															height: 16,
														}}
														disableDragging={isReadOnly}
														dragAxis="x"
														dragGrid={[pixelsPerDay, 1]}
														enableResizing={false}
														key={`${stage._id}-${stage.startDate}-${stage.endDate}-${stageReversionTicks.get(stage._id) ?? 0}-${viewType}`}
														onDragStop={(_e, d) => {
															const newStartOff = Math.round(
																(d.x - GRID_LEFT_PADDING) / pixelsPerDay
															);
															const rawDate = addCalendarDays(
																anchor,
																newStartOff
															);
															const revert = () =>
																setStageReversionTicks((prev) =>
																	new Map(prev).set(
																		stage._id,
																		(prev.get(stage._id) ?? 0) + 1
																	)
																);
															// Reject weekend drops immediately
															if (
																rawDate.getDay() === 0 ||
																rawDate.getDay() === 6
															) {
																revert();
																return;
															}
															// Preserve business-day duration so the end always lands on a weekday
															const bizDuration = Math.max(
																0,
																countBusinessDaysBetween(
																	new Date(stage.startDate),
																	new Date(stage.endDate)
																) - 1
															);
															updateStageDates({
																stageId: stage._id,
																startDate: rawDate.getTime(),
																endDate: addBusinessDays(
																	rawDate,
																	bizDuration
																).getTime(),
															}).catch(revert);
														}}
														style={{ position: 'absolute' }}
													>
														<Popover
															onOpenChange={(open) =>
																setOpenPopoverId(open ? stage._id : null)
															}
															open={openPopoverId === stage._id}
														>
															<PopoverTrigger
																className={`absolute inset-0 overflow-hidden rounded-sm ${stageBarColor} ${isReadOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
															>
																{dayColumns
																	.filter(
																		(col) =>
																			col.isWeekend &&
																			col.dayIndex < stageEndOff + 1 &&
																			col.dayIndex >= stageStartOff
																	)
																	.map((col) => (
																		<div
																			className="absolute inset-y-0"
																			key={col.dayIndex}
																			style={{
																				left:
																					(col.dayIndex - stageStartOff) *
																					pixelsPerDay,
																				width: pixelsPerDay,
																				background:
																					'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
																			}}
																		/>
																	))}
															</PopoverTrigger>
															<PopoverPopup arrow side="top" sideOffset={10}>
																<PopoverTitle className="flex items-center justify-between gap-2">
																	<span>{stage.name}</span>
																	<StatusBadge status={stage.status} />
																</PopoverTitle>
																<PopoverDescription>
																	{formatProjectDate(stage.startDate)}
																	{' → '}
																	{formatProjectDate(stage.endDate)}
																</PopoverDescription>
																<div className="mt-2 flex gap-1">
																	{stage.status !== 'Pending' && (
																		<Button
																			onClick={() =>
																				updateStageStatus({
																					stageId: stage._id,
																					status: 'Pending',
																				})
																			}
																			size="sm"
																			type="button"
																			variant="outline"
																		>
																			Mark Pending
																		</Button>
																	)}
																	{stage.status !== 'In Progress' && (
																		<Button
																			onClick={() =>
																				updateStageStatus({
																					stageId: stage._id,
																					status: 'In Progress',
																				})
																			}
																			size="sm"
																			type="button"
																			variant="outline"
																		>
																			Mark In Progress
																		</Button>
																	)}
																	{stage.status !== 'Complete' && (
																		<Button
																			onClick={() =>
																				updateStageStatus({
																					stageId: stage._id,
																					status: 'Complete',
																				})
																			}
																			size="sm"
																			type="button"
																			variant="outline"
																		>
																			Mark Complete
																		</Button>
																	)}
																</div>
															</PopoverPopup>
														</Popover>
													</Rnd>
													<span
														className="pointer-events-none absolute whitespace-nowrap rounded-sm bg-background/90 px-1 text-muted-foreground text-xs"
														style={{
															left: stageBarLeft + stageBarWidth + 12,
															top: '50%',
															transform: 'translateY(-50%)',
															zIndex: 6,
														}}
													>
														{stage.name}
													</span>
												</>
											) : null}
										</div>

										{/* Task rows */}
										{isExpanded(stage._id) &&
											stageTasks.map((task) => {
												const taskStartOff = dateToCalOffset(
													new Date(task.startDate),
													anchor
												);
												const taskEndOff = dateToCalOffset(
													new Date(task.endDate),
													anchor
												);
												const barLeft =
													GRID_LEFT_PADDING + taskStartOff * pixelsPerDay;
												const barWidth = Math.max(
													pixelsPerDay,
													(taskEndOff - taskStartOff + 1) * pixelsPerDay
												);
												const taskBarColor = getTaskBarColor(task.status);
												const displayDays =
													resizePreview?.taskId === task._id
														? resizePreview.durationDays
														: task.durationDays;

												return (
													<div
														className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
														key={task._id}
														style={{
															height: TASK_ROW_HEIGHT,
															width: gridWidth,
														}}
													>
														{viewType === 'day' &&
															dayColumns
																.filter((col) => col.isWeekend)
																.map((col) => (
																	<div
																		className="absolute inset-y-0 bg-foreground/5"
																		key={col.dayIndex}
																		style={{
																			left:
																				GRID_LEFT_PADDING +
																				col.dayIndex * pixelsPerDay,
																			width: pixelsPerDay,
																		}}
																	/>
																))}
														{headerColumns.map((col) => (
															<div
																className={`absolute inset-y-0 border-border/40 border-r${col.isToday ? 'bg-primary/10' : ''}`}
																key={col.dayIndex}
																style={{
																	left:
																		GRID_LEFT_PADDING +
																		col.dayIndex * pixelsPerDay,
																	width: col.widthDays * pixelsPerDay,
																}}
															/>
														))}
														<Rnd
															default={{
																x: barLeft,
																y: (TASK_ROW_HEIGHT - 16) / 2,
																width: barWidth,
																height: 16,
															}}
															disableDragging={isReadOnly}
															dragAxis="x"
															dragGrid={[pixelsPerDay, 1]}
															enableResizing={
																isReadOnly ? false : { right: true }
															}
															key={`${task._id}-${task.startDate}-${task.endDate}-${taskReversionTicks.get(task._id) ?? 0}-${viewType}`}
															minWidth={pixelsPerDay}
															onDragStop={(_e, d) => {
																const newStartOff = Math.round(
																	(d.x - GRID_LEFT_PADDING) / pixelsPerDay
																);
																const rawDate = addCalendarDays(
																	anchor,
																	newStartOff
																);
																const revert = () =>
																	setTaskReversionTicks((prev) =>
																		new Map(prev).set(
																			task._id,
																			(prev.get(task._id) ?? 0) + 1
																		)
																	);
																// Reject weekend drops — revert the bar immediately
																if (
																	rawDate.getDay() === 0 ||
																	rawDate.getDay() === 6
																) {
																	revert();
																	return;
																}
																// Preserve durationDays in business days
																updateTaskDates({
																	taskId: task._id,
																	startDate: rawDate.getTime(),
																	endDate: addBusinessDays(
																		rawDate,
																		task.durationDays - 1
																	).getTime(),
																	durationDays: task.durationDays,
																}).catch(revert);
															}}
															onResize={(_e, _direction, ref) => {
																const newCalWidth = Math.round(
																	ref.offsetWidth / pixelsPerDay
																);
																const newEndDate = addCalendarDays(
																	new Date(task.startDate),
																	Math.max(0, newCalWidth - 1)
																);
																setResizePreview({
																	taskId: task._id,
																	durationDays: Math.max(
																		1,
																		countBusinessDaysBetween(
																			new Date(task.startDate),
																			newEndDate
																		)
																	),
																});
															}}
															onResizeStop={(_e, _direction, ref) => {
																const newCalWidth = Math.round(
																	ref.offsetWidth / pixelsPerDay
																);
																// Count business days within the dragged width
																const tentativeEnd = addCalendarDays(
																	new Date(task.startDate),
																	Math.max(0, newCalWidth - 1)
																);
																const newDuration = Math.max(
																	1,
																	countBusinessDaysBetween(
																		new Date(task.startDate),
																		tentativeEnd
																	)
																);
																// Derive end date from business days — always a weekday
																const newEndDate = addBusinessDays(
																	new Date(task.startDate),
																	newDuration - 1
																);
																setResizePreview(null);
																updateTaskDates({
																	taskId: task._id,
																	startDate: task.startDate,
																	endDate: newEndDate.getTime(),
																	durationDays: newDuration,
																}).catch(() => {
																	setTaskReversionTicks((prev) =>
																		new Map(prev).set(
																			task._id,
																			(prev.get(task._id) ?? 0) + 1
																		)
																	);
																});
															}}
															resizeGrid={[pixelsPerDay, 1]}
															resizeHandleStyles={{
																right: {
																	cursor: 'ew-resize',
																	height: 24,
																	right: -6,
																	top: -4,
																	width: 12,
																	zIndex: 10,
																},
															}}
															style={{ position: 'absolute' }}
														>
															<Popover
																onOpenChange={(open) =>
																	setOpenPopoverId(open ? task._id : null)
																}
																open={openPopoverId === task._id}
															>
																<PopoverTrigger
																	className={`absolute inset-0 overflow-hidden rounded-sm ${taskBarColor} ${isReadOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
																>
																	{dayColumns
																		.filter(
																			(col) =>
																				col.isWeekend &&
																				col.dayIndex < taskEndOff + 1 &&
																				col.dayIndex >= taskStartOff
																		)
																		.map((col) => (
																			<div
																				className="absolute inset-y-0"
																				key={col.dayIndex}
																				style={{
																					left:
																						(col.dayIndex - taskStartOff) *
																						pixelsPerDay,
																					width: pixelsPerDay,
																					background:
																						'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
																				}}
																			/>
																		))}
																</PopoverTrigger>
																<PopoverPopup arrow side="top" sideOffset={10}>
																	<PopoverTitle className="flex items-center justify-between gap-2">
																		<span>
																			{task.name}
																			{' · '}
																			{displayDays}d
																		</span>
																		<StatusBadge status={task.status} />
																	</PopoverTitle>
																	<PopoverDescription>
																		{formatProjectDate(task.startDate)}
																		{' → '}
																		{formatProjectDate(task.endDate)}
																	</PopoverDescription>
																	<div className="mt-2 flex gap-1">
																		{task.status !== 'Pending' && (
																			<Button
																				onClick={() =>
																					updateTaskStatus({
																						taskId: task._id,
																						status: 'Pending',
																					})
																				}
																				size="sm"
																				type="button"
																				variant="outline"
																			>
																				Mark Pending
																			</Button>
																		)}
																		{task.status !== 'In Progress' && (
																			<Button
																				onClick={() =>
																					updateTaskStatus({
																						taskId: task._id,
																						status: 'In Progress',
																					})
																				}
																				size="sm"
																				type="button"
																				variant="outline"
																			>
																				Mark In Progress
																			</Button>
																		)}
																		{task.status !== 'Complete' && (
																			<Button
																				onClick={() =>
																					updateTaskStatus({
																						taskId: task._id,
																						status: 'Complete',
																					})
																				}
																				size="sm"
																				type="button"
																				variant="outline"
																			>
																				Mark Complete
																			</Button>
																		)}
																	</div>
																</PopoverPopup>
															</Popover>
														</Rnd>
														<span
															className="pointer-events-none absolute whitespace-nowrap rounded-sm bg-background/90 px-1 text-muted-foreground text-xs"
															style={{
																left: barLeft + barWidth + 12,
																top: '50%',
																transform: 'translateY(-50%)',
																zIndex: 6,
															}}
														>
															{task.name}
														</span>
													</div>
												);
											})}
									</div>
								);
							})}

							{/* Dependency arrows */}
							{arrows.length > 0 && (
								<svg
									aria-hidden="true"
									style={{
										height: totalRowHeight,
										left: 0,
										overflow: 'visible',
										pointerEvents: 'none',
										position: 'absolute',
										top: DATE_HEADER_HEIGHT,
										width: gridWidth,
										zIndex: 5,
									}}
								>
									<defs>
										<marker
											id="proj-dep-arrowhead"
											markerHeight="6"
											markerWidth="6"
											orient="auto"
											refX="5"
											refY="3"
										>
											<path d="M 0 0 L 6 3 L 0 6 z" fill="#94a3b8" />
										</marker>
									</defs>
									{arrows.map((arrow) => {
										const d = buildArrowPath(
											arrow.fromX,
											arrow.fromY,
											arrow.toX,
											arrow.toY,
											arrow.depType
										);
										return (
											// biome-ignore lint/a11y/noAriaHiddenOnFocusable: inside aria-hidden SVG
											<g
												aria-hidden="true"
												key={arrow.key}
												onDoubleClick={() => setDeletingArrow(arrow)}
												style={{ cursor: 'pointer', pointerEvents: 'all' }}
											>
												<path
													d={d}
													fill="none"
													markerEnd="url(#proj-dep-arrowhead)"
													stroke="#94a3b8"
													strokeWidth={1.5}
												/>
												<path
													d={d}
													fill="none"
													stroke="transparent"
													strokeWidth={12}
												/>
											</g>
										);
									})}
								</svg>
							)}
						</div>
					</div>
				</div>
			</div>

			<AlertDialog
				onOpenChange={(open) => {
					if (!open) {
						setDeletingArrow(null);
					}
				}}
				open={deletingArrow !== null}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove dependency?</AlertDialogTitle>
						<AlertDialogDescription>
							{deletingArrow
								? `Remove the dependency from "${deletingArrow.fromName}" to "${deletingArrow.toName}".`
								: ''}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<Button
							loading={isDeleting}
							onClick={() => {
								onDeleteDependency().catch(() => {
									/* handled above */
								});
							}}
							variant="destructive"
						>
							Remove dependency
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
