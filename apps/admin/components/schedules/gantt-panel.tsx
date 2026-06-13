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
import { toastManager } from '@workspace/ui/components/toast';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import {
	Tooltip,
	TooltipPopup,
	TooltipProvider,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { useMutation } from 'convex/react';
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StageLayout, TaskLayout } from './schedule-dependency-algorithm';
import { STAGE_ROW_HEIGHT, TASK_ROW_HEIGHT } from './schedule-row-heights';
import StageRow from './stage-row';
import TaskRow from './task-row';

export type ViewMode = 'days' | 'weeks' | 'months';

const DAY_WIDTH = 44;
const WEEK_COLUMN_WIDTH = 80;
const MONTH_COLUMN_WIDTH = 120;
const MIN_DAYS = 20;
const STAGE_LIST_WIDTH = 280;
const GRID_LEFT_PADDING = 24;

interface GanttColumn {
	dayStart: number;
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
): { day: string; month: string } {
	const d = new Date(today);
	d.setDate(d.getDate() + offset);
	return {
		day: d.toLocaleDateString('en-AU', { day: 'numeric' }),
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
			if (!isDragging.current) {
				return;
			}
			const delta = e.clientX - dragStartX.current;
			setLeftPanelWidth(
				Math.max(STAGE_LIST_WIDTH, dragStartWidth.current + delta)
			);
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
			const end = layout.startOffset + layout.durationDays;
			if (end > max) {
				max = end;
			}
		}
		for (const [, layout] of stageLayouts) {
			const end = layout.endOffset + 1;
			if (end > max) {
				max = end;
			}
		}
		return Math.max(max + 2, MIN_DAYS);
	}, [taskLayouts, stageLayouts]);

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
		(startOffset: number, durationDays: number) => {
			if (!rightRef.current) {
				return;
			}
			const barLeft = GRID_LEFT_PADDING + startOffset * pixelsPerDay;
			const barWidth = durationDays * pixelsPerDay;
			const containerWidth = rightRef.current.clientWidth;
			const targetLeft = barLeft - (containerWidth - barWidth) / 2;
			rightRef.current.scrollTo({
				left: Math.max(0, targetLeft),
				behavior: 'smooth',
			});
		},
		[pixelsPerDay]
	);

	const columns = useMemo<GanttColumn[]>(() => {
		if (viewMode === 'weeks') {
			return getWeekColumns(today, totalDays);
		}
		if (viewMode === 'months') {
			return getMonthColumns(today, totalDays);
		}
		return Array.from({ length: totalDays }, (_, i) => {
			const { day, month } = getDayLabel(today, i);
			return { dayStart: i, widthDays: 1, label: day, subLabel: month };
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
						(predLayout.startOffset + predLayout.durationDays) * pixelsPerDay
					: GRID_LEFT_PADDING + predLayout.startOffset * pixelsPerDay;
			const toX = GRID_LEFT_PADDING + myLayout.startOffset * pixelsPerDay;
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
					? GRID_LEFT_PADDING + (predLayout.endOffset + 1) * pixelsPerDay
					: GRID_LEFT_PADDING + predLayout.startOffset * pixelsPerDay;
			const toX = GRID_LEFT_PADDING + myLayout.startOffset * pixelsPerDay;
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
	}, [tasks, stages, taskLayouts, stageLayouts, rowYMap, pixelsPerDay]);

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
		<TooltipProvider>
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
							style={{ height: STAGE_ROW_HEIGHT }}
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
								style={{ height: STAGE_ROW_HEIGHT }}
							>
								{/* Left padding cell before first column */}
								<div
									className="shrink-0"
									style={{ width: GRID_LEFT_PADDING }}
								/>
								{columns.map((col) => (
									<div
										className="flex shrink-0 flex-col items-center justify-center border-r text-muted-foreground text-xs"
										key={col.dayStart}
										style={{ width: col.widthDays * pixelsPerDay }}
									>
										<span className="font-medium leading-tight">
											{col.label}
										</span>
										{col.subLabel && (
											<span className="leading-tight opacity-70">
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
													className="absolute inset-y-0 border-border/40 border-r"
													key={col.dayStart}
													style={{
														left:
															GRID_LEFT_PADDING + col.dayStart * pixelsPerDay,
														width: col.widthDays * pixelsPerDay,
													}}
												/>
											))}
											{stageLayout &&
											stageLayout.endOffset >= stageLayout.startOffset ? (
												<Tooltip>
													<TooltipTrigger
														className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-emerald-500/70"
														style={{
															height: 16,
															left:
																GRID_LEFT_PADDING +
																stageLayout.startOffset * pixelsPerDay,
															width:
																(stageLayout.endOffset -
																	stageLayout.startOffset +
																	1) *
																pixelsPerDay,
														}}
													/>
													<TooltipPopup>
														<span className="font-medium">{stage.name}</span>
														{' · '}
														{stageLayout.endOffset -
															stageLayout.startOffset +
															1}
														d
													</TooltipPopup>
												</Tooltip>
											) : null}
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
																className="absolute inset-y-0 border-border/40 border-r"
																key={col.dayStart}
																style={{
																	left:
																		GRID_LEFT_PADDING +
																		col.dayStart * pixelsPerDay,
																	width: col.widthDays * pixelsPerDay,
																}}
															/>
														))}
														{taskLayout ? (
															<Tooltip>
																<TooltipTrigger
																	className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-blue-500/70"
																	style={{
																		height: 16,
																		left:
																			GRID_LEFT_PADDING +
																			taskLayout.startOffset * pixelsPerDay,
																		width:
																			taskLayout.durationDays * pixelsPerDay,
																	}}
																/>
																<TooltipPopup>
																	<span className="font-medium">
																		{task.name}
																	</span>
																	{' · '}
																	{taskLayout.durationDays}d
																</TooltipPopup>
															</Tooltip>
														) : null}
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
										top: STAGE_ROW_HEIGHT,
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
		</TooltipProvider>
	);
}
