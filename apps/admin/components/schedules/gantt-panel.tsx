'use client';

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
import { Button } from '@workspace/ui/components/button';
import {
	Popover,
	PopoverDescription,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { toastManager } from '@workspace/ui/components/toast';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { useMutation } from 'convex/react';
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import {
	businessDayToCalendarOffset,
	calendarOffsetToBusinessDayOffset,
	countBusinessDaysInRange,
} from './schedule-calendar-utils';
import type { StageLayout, TaskLayout } from './schedule-dependency-algorithm';
import { STAGE_ROW_HEIGHT, TASK_ROW_HEIGHT } from './schedule-row-heights';
import StageRow from './stage-row';
import TaskRow from './task-row';

export type ViewMode = 'days' | 'weeks' | 'months';

const DAY_WIDTH = 50;
const WEEK_COLUMN_WIDTH = 100;
const MONTH_COLUMN_WIDTH = 150;
const DATE_HEADER_HEIGHT = 52;
const MIN_DAYS = 20;
const STAGE_LIST_WIDTH = 280;
const GRID_LEFT_PADDING = 24;

interface GanttColumn {
	dayName?: string;
	dayStart: number;
	isWeekend?: boolean;
	label: string;
	subLabel?: string;
	widthDays: number;
}

interface ArrowDef {
	dependentStageId?: Id<'scheduleStages'>;
	dependentTaskId?: Id<'scheduleTasks'>;
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
		// 2-corner path: jog left, go down, arrive at toX from the left (→)
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

	// startAfter: 4-corner Z/S path so the arrowhead arrives pointing RIGHT (→)
	// Route: right from fromX → down to midY → left past toX → down to toY → right to toX
	const midXr = fromX + JOG; // right jog past predecessor's end
	const midXl = toX - JOG; // left jog before dependent's start
	const dy = toY >= fromY ? 1 : -1;
	const midY = toY - dy * JOG; // horizontal leg sits JOG px before the dependent bar
	// dxH: direction of the middle horizontal segment
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
		`Q ${midXr} ${fromY} ${midXr} ${fromY + dy * r}`, // corner 1: right → down
		`V ${midY - dy * r}`,
		`Q ${midXr} ${midY} ${midXr + dxH * r} ${midY}`, // corner 2: down → horizontal
		`H ${midXl - dxH * r}`,
		`Q ${midXl} ${midY} ${midXl} ${midY + dy * r}`, // corner 3: horizontal → down
		`V ${toY - dy * r}`,
		`Q ${midXl} ${toY} ${midXl + r} ${toY}`, // corner 4: down → right
		`H ${toX}`,
	].join(' ');
}

function getDayLabel(
	today: Date,
	offset: number
): { day: string; dayName: string; isWeekend: boolean; month: string } {
	const d = new Date(today);
	d.setDate(d.getDate() + offset);
	const dow = d.getDay();
	return {
		day: d.toLocaleDateString('en-AU', { day: 'numeric' }),
		dayName: d.toLocaleDateString('en-AU', { weekday: 'short' }),
		isWeekend: dow === 0 || dow === 6,
		month: d.toLocaleDateString('en-AU', { month: 'short' }),
	};
}

function getWeekColumns(today: Date, totalDays: number): GanttColumn[] {
	const cols: GanttColumn[] = [];
	let d = 0;
	while (d < totalDays) {
		const widthDays = Math.min(7, totalDays - d);
		const date = new Date(today);
		date.setDate(date.getDate() + d);
		const label = date.toLocaleDateString('en-AU', {
			day: 'numeric',
			month: 'short',
		});
		cols.push({ dayStart: d, widthDays, label });
		d += 7;
	}
	return cols;
}

function getMonthColumns(today: Date, totalDays: number): GanttColumn[] {
	const cols: GanttColumn[] = [];
	let d = 0;
	while (d < totalDays) {
		const date = new Date(today);
		date.setDate(date.getDate() + d);
		const year = date.getFullYear();
		const month = date.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const dayOfMonth = date.getDate();
		const remainingInMonth = daysInMonth - dayOfMonth + 1;
		const widthDays = Math.min(remainingInMonth, totalDays - d);
		const label = date.toLocaleDateString('en-AU', {
			month: 'short',
			year: 'numeric',
		});
		cols.push({ dayStart: d, widthDays, label });
		d += remainingInMonth;
	}
	return cols;
}

function isWeekendCalOffset(calOffset: number, today: Date): boolean {
	const d = new Date(today);
	d.setDate(d.getDate() + Math.floor(calOffset));
	const dow = d.getDay();
	return dow === 0 || dow === 6;
}

function computeTaskOffsetDays(
	task: Doc<'scheduleTasks'>,
	newBizStart: number,
	taskLayouts: Map<string, TaskLayout>
): number {
	const currentBizStart = taskLayouts.get(task._id)?.startOffset ?? newBizStart;
	return (task.offsetDays ?? 0) + (newBizStart - currentBizStart);
}

function isValidTaskDragPosition(
	task: Doc<'scheduleTasks'>,
	newBizStart: number,
	taskLayouts: Map<string, TaskLayout>
): boolean {
	if (task.dependencyTaskId && task.dependencyType) {
		const pred = taskLayouts.get(task.dependencyTaskId);
		if (!pred) {
			return true;
		}
		return task.dependencyType === 'startAfter'
			? newBizStart >= pred.startOffset + pred.durationDays
			: newBizStart >= pred.startOffset;
	}
	return newBizStart >= 0;
}

function computeStageOffsetDays(
	stage: Doc<'scheduleStages'>,
	newBizStart: number,
	stageLayouts: Map<string, StageLayout>
): number {
	const currentBizStart =
		stageLayouts.get(stage._id)?.startOffset ?? newBizStart;
	return (stage.offsetDays ?? 0) + (newBizStart - currentBizStart);
}

function isValidStageDragPosition(
	stage: Doc<'scheduleStages'>,
	newBizStart: number,
	stageLayouts: Map<string, StageLayout>
): boolean {
	if (stage.dependencyStageId && stage.dependencyType) {
		const dep = stageLayouts.get(stage.dependencyStageId);
		if (!dep) {
			return true;
		}
		return stage.dependencyType === 'startAfter'
			? newBizStart >= dep.endOffset + 1
			: newBizStart >= dep.startOffset;
	}
	return newBizStart >= 0;
}

export default function GanttPanel({
	stages,
	tasks,
	stageLayouts,
	taskLayouts,
	scheduleTemplateId,
	viewMode,
	onViewModeChange,
	search,
}: {
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	stageLayouts: Map<string, StageLayout>;
	taskLayouts: Map<string, TaskLayout>;
	scheduleTemplateId: Id<'scheduleTemplates'>;
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	search?: string;
}) {
	const [collapsedStages, setCollapsedStages] = useState<Set<string>>(
		new Set()
	);
	const [deletingArrow, setDeletingArrow] = useState<ArrowDef | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [leftPanelWidth, setLeftPanelWidth] = useState(STAGE_LIST_WIDTH);
	const isDragging = useRef(false);
	const dragStartX = useRef(0);
	const dragStartWidth = useRef(0);

	const clearTaskDependency = useMutation(
		api.scheduleTasks.clearDependency.clearDependency
	);
	const clearStageDependency = useMutation(
		api.scheduleStages.clearDependency.clearDependency
	);
	const updateTaskDuration = useMutation(
		api.scheduleTasks.updateDuration.updateDuration
	);
	const updateTaskOffset = useMutation(
		api.scheduleTasks.updateOffset.updateOffset
	);
	const updateStageOffset = useMutation(
		api.scheduleStages.updateOffset.updateOffset
	);

	const [resizePreview, setResizePreview] = useState<{
		taskId: string;
		durationDays: number;
	} | null>(null);
	const [dragMovePreview, setDragMovePreview] = useState<{
		id: string;
		startOffset: number;
	} | null>(null);
	const [stageReversionTicks, setStageReversionTicks] = useState<
		Map<string, number>
	>(new Map());
	const [taskReversionTicks, setTaskReversionTicks] = useState<
		Map<string, number>
	>(new Map());

	const leftRef = useRef<HTMLDivElement>(null);
	const rightRef = useRef<HTMLDivElement>(null);
	const isSyncing = useRef(false);

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

	const expandAll = useCallback(() => {
		setCollapsedStages(new Set());
	}, []);

	const collapseAll = useCallback(() => {
		setCollapsedStages(new Set(stages.map((s) => s._id)));
	}, [stages]);

	const onResizeMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			isDragging.current = true;
			dragStartX.current = e.clientX;
			dragStartWidth.current = leftPanelWidth;
		},
		[leftPanelWidth]
	);

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (isDragging.current) {
				const delta = e.clientX - dragStartX.current;
				setLeftPanelWidth(
					Math.max(STAGE_LIST_WIDTH, dragStartWidth.current + delta)
				);
			}
		};
		const onMouseUp = () => {
			isDragging.current = false;
		};
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, []);

	const today = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	const formatOffset = useCallback(
		(offset: number): string => {
			const calOffset = businessDayToCalendarOffset(offset, today);
			const d = new Date(today);
			d.setDate(d.getDate() + calOffset);
			const day = d.getDate();
			const month = d.toLocaleString('en-GB', { month: 'short' });
			const year = d.getFullYear();
			return `${day} ${month}, ${year}`;
		},
		[today]
	);

	const tasksByStage = useMemo(() => {
		const map = new Map<string, Doc<'scheduleTasks'>[]>();
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
				stage: Doc<'scheduleStages'>;
				tasks: Doc<'scheduleTasks'>[];
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
			const stageDataMap = new Map<string, Doc<'scheduleTasks'>[]>(
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

	const totalDays = useMemo(() => {
		let max = MIN_DAYS;
		for (const [, layout] of taskLayouts) {
			const calEnd =
				businessDayToCalendarOffset(
					layout.startOffset + layout.durationDays - 1,
					today
				) + 1;
			if (calEnd > max) {
				max = calEnd;
			}
		}
		for (const [, layout] of stageLayouts) {
			const calEnd = businessDayToCalendarOffset(layout.endOffset, today) + 1;
			if (calEnd > max) {
				max = calEnd;
			}
		}
		return Math.max(max + 2, MIN_DAYS);
	}, [taskLayouts, stageLayouts, today]);

	const pixelsPerDay = useMemo(() => {
		if (viewMode === 'weeks') {
			return WEEK_COLUMN_WIDTH / 7;
		}
		if (viewMode === 'months') {
			return MONTH_COLUMN_WIDTH / 30;
		}
		return DAY_WIDTH;
	}, [viewMode]);

	const gridWidth = GRID_LEFT_PADDING + totalDays * pixelsPerDay;

	const scrollToBar = useCallback(
		(startBizDay: number, durationBizDays: number) => {
			if (!rightRef.current) {
				return;
			}
			const calStart = businessDayToCalendarOffset(startBizDay, today);
			const calEnd = businessDayToCalendarOffset(
				startBizDay + durationBizDays - 1,
				today
			);
			const barLeft = GRID_LEFT_PADDING + calStart * pixelsPerDay;
			const barWidth = (calEnd - calStart + 1) * pixelsPerDay;
			const containerWidth = rightRef.current.clientWidth;
			const targetLeft = barLeft - (containerWidth - barWidth) / 2;
			rightRef.current.scrollTo({
				left: Math.max(0, targetLeft),
				behavior: 'smooth',
			});
		},
		[pixelsPerDay, today]
	);

	const columns = useMemo<GanttColumn[]>(() => {
		if (viewMode === 'weeks') {
			return getWeekColumns(today, totalDays);
		}
		if (viewMode === 'months') {
			return getMonthColumns(today, totalDays);
		}
		return Array.from({ length: totalDays }, (_, i) => {
			const { day, dayName, month, isWeekend } = getDayLabel(today, i);
			return {
				dayName,
				dayStart: i,
				isWeekend,
				label: day,
				subLabel: month,
				widthDays: 1,
			};
		});
	}, [viewMode, today, totalDays]);

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

		for (const task of tasks) {
			if (!(task.dependencyTaskId && task.dependencyType)) {
				continue;
			}
			const predLayout = taskLayouts.get(task.dependencyTaskId);
			const myLayout = taskLayouts.get(task._id);
			if (!(predLayout && myLayout)) {
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
						(businessDayToCalendarOffset(
							predLayout.startOffset + predLayout.durationDays - 1,
							today
						) +
							1) *
							pixelsPerDay
					: GRID_LEFT_PADDING +
						businessDayToCalendarOffset(predLayout.startOffset, today) *
							pixelsPerDay;
			const toX =
				GRID_LEFT_PADDING +
				businessDayToCalendarOffset(myLayout.startOffset, today) * pixelsPerDay;
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
			const predLayout = stageLayouts.get(stage.dependencyStageId);
			const myLayout = stageLayouts.get(stage._id);
			if (!(predLayout && myLayout)) {
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
						(businessDayToCalendarOffset(predLayout.endOffset, today) + 1) *
							pixelsPerDay
					: GRID_LEFT_PADDING +
						businessDayToCalendarOffset(predLayout.startOffset, today) *
							pixelsPerDay;
			const toX =
				GRID_LEFT_PADDING +
				businessDayToCalendarOffset(myLayout.startOffset, today) * pixelsPerDay;
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
	}, [tasks, stages, taskLayouts, stageLayouts, rowYMap, pixelsPerDay, today]);

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
					No stages yet. Add a stage to get started.
				</p>
			</div>
		);
	}

	return (
		<>
			{/*
			 * min-w-0 prevents this flex-1 child from expanding past the parent's
			 * width. Without it the right panel's gridWidth inflates the whole panel.
			 */}
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				{/* Toolbar */}
				<div className="flex shrink-0 items-center justify-end gap-2 border-b px-3 py-2">
					<ToggleGroup
						aria-label="Calendar view mode"
						onValueChange={(val) => {
							if (val.length > 0) {
								onViewModeChange(val[0] as ViewMode);
							}
						}}
						size="sm"
						value={[viewMode]}
						variant="outline"
					>
						<ToggleGroupItem value="days">Days</ToggleGroupItem>
						<ToggleGroupItem value="weeks">Weeks</ToggleGroupItem>
						<ToggleGroupItem value="months">Months</ToggleGroupItem>
					</ToggleGroup>
					<Button onClick={expandAll} size="sm" type="button" variant="outline">
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

				{/*
				 * overflow-hidden here ensures the two child panels are bounded within
				 * the available space rather than inflating this row container.
				 */}
				<div className="flex min-h-0 flex-1 overflow-hidden">
					{/*
					 * Left panel — stage/task labels.
					 * Fixed width, vertical scroll only. Scrollbar hidden; scroll is
					 * driven by the right panel via onRightScroll.
					 * bg-background gives task rows (which are transparent) their bg.
					 */}
					<div
						className="shrink-0 overflow-y-auto overflow-x-hidden bg-background [&::-webkit-scrollbar]:hidden"
						onScroll={onLeftScroll}
						ref={leftRef}
						style={{ scrollbarWidth: 'none', width: leftPanelWidth }}
					>
						{/* Corner cell matches day-header height */}
						<div
							className="sticky top-0 z-10 border-b bg-background"
							style={{ height: DATE_HEADER_HEIGHT }}
						/>

						{displayedStages.map((stage) => {
							const stageTasks = getDisplayedTasks(stage._id);
							const stageLayout = stageLayouts.get(stage._id);
							return (
								<div key={stage._id}>
									{/* StageRow owns its own height, bg-muted/40, and border-b */}
									<StageRow
										isCollapsed={!isExpanded(stage._id)}
										onNameClick={
											stageLayout
												? () =>
														scrollToBar(
															stageLayout.startOffset,
															stageLayout.endOffset -
																stageLayout.startOffset +
																1
														)
												: undefined
										}
										onToggleCollapse={() => toggleStage(stage._id)}
										scheduleTemplateId={scheduleTemplateId}
										stage={stage}
										stageLayout={stageLayout}
										stages={stages}
										tasks={stageTasks}
									/>
									{isExpanded(stage._id) &&
										stageTasks.map((task) => {
											const taskLayout = taskLayouts.get(task._id);
											return (
												/* TaskRow owns its own height and border-b */
												<TaskRow
													key={task._id}
													onNameClick={
														taskLayout
															? () =>
																	scrollToBar(
																		taskLayout.startOffset,
																		taskLayout.durationDays
																	)
															: undefined
													}
													task={task}
													tasks={stageTasks}
												/>
											);
										})}
								</div>
							);
						})}
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

					{/*
					 * Right panel — dates grid.
					 * min-w-0 prevents this flex-1 item from expanding to fit gridWidth.
					 * overflow-auto creates the horizontal scrollbar only here.
					 */}
					<div
						className="min-w-0 flex-1 overflow-auto"
						onScroll={onRightScroll}
						ref={rightRef}
					>
						<div className="relative" style={{ width: gridWidth }}>
							{/* Day label header — sticks to the top of the right panel */}
							<div
								className="sticky top-0 z-10 flex border-b bg-background"
								style={{ height: DATE_HEADER_HEIGHT }}
							>
								{/* Left padding cell before first column */}
								<div
									className="shrink-0"
									style={{ width: GRID_LEFT_PADDING }}
								/>
								{columns.map((col) => (
									<div
										className={`flex shrink-0 flex-col items-center justify-center gap-0.5 border-r text-muted-foreground text-xs ${col.isWeekend ? 'bg-foreground/5' : ''}`}
										key={col.dayStart}
										style={{ width: col.widthDays * pixelsPerDay }}
									>
										{col.dayName && (
											<span className="text-[10px] leading-none opacity-60">
												{col.dayName}
											</span>
										)}
										<span className="font-medium leading-none">
											{col.label}
										</span>
										{col.subLabel && (
											<span className="text-[10px] leading-none opacity-70">
												{col.subLabel}
											</span>
										)}
									</div>
								))}
							</div>

							{/* Grid rows — one per stage, then per task */}
							{displayedStages.map((stage, stageIndex) => {
								const stageLayout = stageLayouts.get(stage._id);
								const stageTasks = getDisplayedTasks(stage._id);
								const isEven = stageIndex % 2 === 0;

								return (
									<div key={stage._id}>
										{/* Stage bar */}
										<div
											className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
											style={{ height: STAGE_ROW_HEIGHT, width: gridWidth }}
										>
											{columns.map((col) => (
												<div
													className={`absolute inset-y-0 border-border/40 border-r ${col.isWeekend ? 'bg-foreground/5' : ''}`}
													key={col.dayStart}
													style={{
														left:
															GRID_LEFT_PADDING + col.dayStart * pixelsPerDay,
														width: col.widthDays * pixelsPerDay,
													}}
												/>
											))}
											{stageLayout &&
											stageLayout.endOffset >= stageLayout.startOffset
												? (() => {
														const calStart = businessDayToCalendarOffset(
															stageLayout.startOffset,
															today
														);
														const calEnd = businessDayToCalendarOffset(
															stageLayout.endOffset,
															today
														);
														return (
															<Rnd
																default={{
																	x:
																		GRID_LEFT_PADDING + calStart * pixelsPerDay,
																	y: STAGE_ROW_HEIGHT / 2 - 8,
																	width: (calEnd - calStart + 1) * pixelsPerDay,
																	height: 16,
																}}
																dragAxis="x"
																dragGrid={[pixelsPerDay, 1]}
																enableResizing={false}
																key={`${stage._id}-${stageLayout.startOffset}-${stageLayout.endOffset}-${stageReversionTicks.get(stage._id) ?? 0}`}
																onDrag={(_e, d) => {
																	const newCalStart =
																		(d.x - GRID_LEFT_PADDING) / pixelsPerDay;
																	const newBizStart =
																		calendarOffsetToBusinessDayOffset(
																			newCalStart,
																			today
																		);
																	setDragMovePreview({
																		id: stage._id,
																		startOffset: newBizStart,
																	});
																}}
																onDragStop={(_e, d) => {
																	const newCalStart =
																		(d.x - GRID_LEFT_PADDING) / pixelsPerDay;
																	const newBizStart =
																		calendarOffsetToBusinessDayOffset(
																			newCalStart,
																			today
																		);
																	const newOffsetDays = computeStageOffsetDays(
																		stage,
																		newBizStart,
																		stageLayouts
																	);
																	setDragMovePreview(null);
																	if (
																		!isValidStageDragPosition(
																			stage,
																			newBizStart,
																			stageLayouts
																		)
																	) {
																		setStageReversionTicks((prev) =>
																			new Map(prev).set(
																				stage._id,
																				(prev.get(stage._id) ?? 0) + 1
																			)
																		);
																		return;
																	}
																	updateStageOffset({
																		stageId: stage._id,
																		offsetDays: newOffsetDays,
																	}).catch(() => {
																		// Convex reactive queries revert the UI automatically
																	});
																}}
																style={{ position: 'absolute' }}
															>
																<Popover>
																	<PopoverTrigger className="absolute inset-0 cursor-grab overflow-hidden rounded-sm bg-purple-500/70 active:cursor-grabbing">
																		{columns
																			.filter(
																				(col) =>
																					col.isWeekend &&
																					col.dayStart < calEnd + 1 &&
																					col.dayStart + col.widthDays >
																						calStart
																			)
																			.map((col) => {
																				const overlapStart = Math.max(
																					col.dayStart,
																					calStart
																				);
																				const overlapEnd = Math.min(
																					col.dayStart + col.widthDays,
																					calEnd + 1
																				);
																				return (
																					<div
																						className="absolute inset-y-0"
																						key={col.dayStart}
																						style={{
																							left:
																								(overlapStart - calStart) *
																								pixelsPerDay,
																							width:
																								(overlapEnd - overlapStart) *
																								pixelsPerDay,
																							background:
																								'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
																						}}
																					/>
																				);
																			})}
																	</PopoverTrigger>
																	<PopoverPopup side="top">
																		<PopoverTitle>
																			{stage.name}
																			{' · '}
																			{stageLayout.endOffset -
																				stageLayout.startOffset +
																				1}
																			d
																		</PopoverTitle>
																		<PopoverDescription>
																			{formatOffset(
																				dragMovePreview?.id === stage._id
																					? dragMovePreview.startOffset
																					: stageLayout.startOffset
																			)}
																			{' → '}
																			{formatOffset(stageLayout.endOffset)}
																		</PopoverDescription>
																	</PopoverPopup>
																</Popover>
															</Rnd>
														);
													})()
												: null}
										</div>

										{/* Task bars */}
										{isExpanded(stage._id) &&
											stageTasks.map((task) => {
												const taskLayout = taskLayouts.get(task._id);
												return (
													<div
														className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
														key={task._id}
														style={{
															height: TASK_ROW_HEIGHT,
															width: gridWidth,
														}}
													>
														{columns.map((col) => (
															<div
																className={`absolute inset-y-0 border-border/40 border-r ${col.isWeekend ? 'bg-foreground/5' : ''}`}
																key={col.dayStart}
																style={{
																	left:
																		GRID_LEFT_PADDING +
																		col.dayStart * pixelsPerDay,
																	width: col.widthDays * pixelsPerDay,
																}}
															/>
														))}
														{taskLayout
															? (() => {
																	const calStart = businessDayToCalendarOffset(
																		taskLayout.startOffset,
																		today
																	);
																	const calEnd = businessDayToCalendarOffset(
																		taskLayout.startOffset +
																			taskLayout.durationDays -
																			1,
																		today
																	);
																	const barWidth =
																		(calEnd - calStart + 1) * pixelsPerDay;
																	const barLeft =
																		GRID_LEFT_PADDING + calStart * pixelsPerDay;
																	const displayDays =
																		resizePreview?.taskId === task._id
																			? resizePreview.durationDays
																			: taskLayout.durationDays;
																	return (
																		<Rnd
																			default={{
																				x: barLeft,
																				y: (TASK_ROW_HEIGHT - 16) / 2,
																				width: barWidth,
																				height: 16,
																			}}
																			dragAxis="x"
																			dragGrid={[pixelsPerDay, 1]}
																			enableResizing={{ right: true }}
																			key={`${task._id}-${taskLayout.durationDays}-${taskLayout.startOffset}-${taskReversionTicks.get(task._id) ?? 0}`}
																			minWidth={pixelsPerDay}
																			onDrag={(_e, d) => {
																				const newCalStart =
																					(d.x - GRID_LEFT_PADDING) /
																					pixelsPerDay;
																				const newBizStart =
																					calendarOffsetToBusinessDayOffset(
																						newCalStart,
																						today
																					);
																				setDragMovePreview({
																					id: task._id,
																					startOffset: newBizStart,
																				});
																			}}
																			onDragStop={(_e, d) => {
																				const newCalStart =
																					(d.x - GRID_LEFT_PADDING) /
																					pixelsPerDay;
																				const newBizStart =
																					calendarOffsetToBusinessDayOffset(
																						newCalStart,
																						today
																					);
																				const newOffsetDays =
																					computeTaskOffsetDays(
																						task,
																						newBizStart,
																						taskLayouts
																					);
																				setDragMovePreview(null);
																				if (
																					isWeekendCalOffset(
																						newCalStart,
																						today
																					) ||
																					!isValidTaskDragPosition(
																						task,
																						newBizStart,
																						taskLayouts
																					)
																				) {
																					setTaskReversionTicks((prev) =>
																						new Map(prev).set(
																							task._id,
																							(prev.get(task._id) ?? 0) + 1
																						)
																					);
																					return;
																				}
																				updateTaskOffset({
																					taskId: task._id,
																					offsetDays: newOffsetDays,
																				}).catch(() => {
																					// Convex reactive queries revert the UI automatically
																				});
																			}}
																			onResize={(_e, _direction, ref) => {
																				const newCalWidth = Math.round(
																					ref.offsetWidth / pixelsPerDay
																				);
																				const newBizDays =
																					countBusinessDaysInRange(
																						calStart,
																						calStart + newCalWidth - 1,
																						today
																					);
																				setResizePreview({
																					taskId: task._id,
																					durationDays: Math.max(1, newBizDays),
																				});
																			}}
																			onResizeStop={(_e, _direction, ref) => {
																				const newCalWidth = Math.round(
																					ref.offsetWidth / pixelsPerDay
																				);
																				const newBizDays =
																					countBusinessDaysInRange(
																						calStart,
																						calStart + newCalWidth - 1,
																						today
																					);
																				setResizePreview(null);
																				updateTaskDuration({
																					taskId: task._id,
																					durationDays: Math.max(1, newBizDays),
																				}).catch(() => {
																					// Convex reactive queries revert the UI automatically
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
																			<Popover>
																				<PopoverTrigger className="absolute inset-0 cursor-grab overflow-hidden rounded-sm bg-blue-500/70 active:cursor-grabbing">
																					{columns
																						.filter(
																							(col) =>
																								col.isWeekend &&
																								col.dayStart < calEnd + 1 &&
																								col.dayStart + col.widthDays >
																									calStart
																						)
																						.map((col) => {
																							const overlapStart = Math.max(
																								col.dayStart,
																								calStart
																							);
																							const overlapEnd = Math.min(
																								col.dayStart + col.widthDays,
																								calEnd + 1
																							);
																							return (
																								<div
																									className="absolute inset-y-0"
																									key={col.dayStart}
																									style={{
																										left:
																											(overlapStart -
																												calStart) *
																											pixelsPerDay,
																										width:
																											(overlapEnd -
																												overlapStart) *
																											pixelsPerDay,
																										background:
																											'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
																									}}
																								/>
																							);
																						})}
																				</PopoverTrigger>
																				<PopoverPopup side="top">
																					<PopoverTitle>
																						{task.name}
																						{' · '}
																						{displayDays}d
																					</PopoverTitle>
																					<PopoverDescription>
																						{formatOffset(
																							dragMovePreview?.id === task._id
																								? dragMovePreview.startOffset
																								: taskLayout.startOffset
																						)}
																						{' → '}
																						{formatOffset(
																							(dragMovePreview?.id === task._id
																								? dragMovePreview.startOffset
																								: taskLayout.startOffset) +
																								taskLayout.durationDays -
																								1
																						)}
																					</PopoverDescription>
																				</PopoverPopup>
																			</Popover>
																		</Rnd>
																	);
																})()
															: null}
													</div>
												);
											})}
									</div>
								);
							})}

							{/* Dependency arrows SVG overlay */}
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
											id="dep-arrowhead"
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
											// biome-ignore lint/a11y/noAriaHiddenOnFocusable: g element is inside an aria-hidden SVG and is not keyboard-focusable
											<g
												aria-hidden="true"
												key={arrow.key}
												onDoubleClick={() => setDeletingArrow(arrow)}
												style={{ cursor: 'pointer', pointerEvents: 'all' }}
											>
												<path
													d={d}
													fill="none"
													markerEnd="url(#dep-arrowhead)"
													stroke="#94a3b8"
													strokeWidth={1.5}
												/>
												{/* Wider invisible hit area for easier double-click */}
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
									/* handled in onDeleteDependency */
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
