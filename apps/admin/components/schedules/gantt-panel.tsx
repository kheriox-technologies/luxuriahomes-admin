'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Tooltip,
	TooltipPopup,
	TooltipProvider,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { StageLayout, TaskLayout } from './schedule-dependency-algorithm';
import { STAGE_ROW_HEIGHT, TASK_ROW_HEIGHT } from './schedule-row-heights';
import StageRow from './stage-row';
import TaskRow from './task-row';

const DAY_WIDTH = 44;
const MIN_DAYS = 20;
const STAGE_LIST_WIDTH = 280;

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

export default function GanttPanel({
	stages,
	tasks,
	stageLayouts,
	taskLayouts,
	scheduleTemplateId,
}: {
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	stageLayouts: Map<string, StageLayout>;
	taskLayouts: Map<string, TaskLayout>;
	scheduleTemplateId: Id<'scheduleTemplates'>;
}) {
	const [collapsedStages, setCollapsedStages] = useState<Set<string>>(
		new Set()
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

	const gridWidth = totalDays * DAY_WIDTH;
	const dayOffsets = useMemo(
		() => Array.from({ length: totalDays }, (_, i) => i),
		[totalDays]
	);

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
						className="shrink-0 overflow-y-auto overflow-x-hidden border-r bg-background [&::-webkit-scrollbar]:hidden"
						onScroll={onLeftScroll}
						ref={leftRef}
						style={{ scrollbarWidth: 'none', width: STAGE_LIST_WIDTH }}
					>
						{/* Corner cell matches day-header height */}
						<div
							className="sticky top-0 z-10 border-b bg-background"
							style={{ height: STAGE_ROW_HEIGHT }}
						/>

						{stages.map((stage) => {
							const stageTasks = tasksByStage.get(stage._id) ?? [];
							return (
								<div key={stage._id}>
									{/* StageRow owns its own height, bg-muted/40, and border-b */}
									<StageRow
										isCollapsed={collapsedStages.has(stage._id)}
										onToggleCollapse={() => toggleStage(stage._id)}
										scheduleTemplateId={scheduleTemplateId}
										stage={stage}
										stageLayout={stageLayouts.get(stage._id)}
										stages={stages}
										tasks={stageTasks}
									/>
									{!collapsedStages.has(stage._id) &&
										stageTasks.map((task) => (
											/* TaskRow owns its own height and border-b */
											<TaskRow key={task._id} task={task} tasks={stageTasks} />
										))}
								</div>
							);
						})}
					</div>

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
						<div style={{ width: gridWidth }}>
							{/* Day label header — sticks to the top of the right panel */}
							<div
								className="sticky top-0 z-10 flex border-b bg-background"
								style={{ height: STAGE_ROW_HEIGHT }}
							>
								{dayOffsets.map((day) => {
									const { day: dayNum, month } = getDayLabel(today, day);
									return (
										<div
											className="flex shrink-0 flex-col items-center justify-center border-r text-muted-foreground text-xs"
											key={day}
											style={{ width: DAY_WIDTH }}
										>
											<span className="font-medium leading-tight">
												{dayNum}
											</span>
											<span className="leading-tight opacity-70">{month}</span>
										</div>
									);
								})}
							</div>

							{/* Grid rows — one per stage, then per task */}
							{stages.map((stage, stageIndex) => {
								const stageLayout = stageLayouts.get(stage._id);
								const stageTasks = tasksByStage.get(stage._id) ?? [];
								const isEven = stageIndex % 2 === 0;

								return (
									<div key={stage._id}>
										{/* Stage bar */}
										<div
											className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
											style={{ height: STAGE_ROW_HEIGHT, width: gridWidth }}
										>
											{dayOffsets.map((day) => (
												<div
													className="absolute inset-y-0 border-border/40 border-r"
													key={day}
													style={{ left: day * DAY_WIDTH, width: DAY_WIDTH }}
												/>
											))}
											{stageLayout &&
											stageLayout.endOffset >= stageLayout.startOffset ? (
												<Tooltip>
													<TooltipTrigger
														className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-emerald-500/70"
														style={{
															height: 8,
															left: stageLayout.startOffset * DAY_WIDTH,
															width:
																(stageLayout.endOffset -
																	stageLayout.startOffset +
																	1) *
																DAY_WIDTH,
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
										{!collapsedStages.has(stage._id) &&
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
														{dayOffsets.map((day) => (
															<div
																className="absolute inset-y-0 border-border/40 border-r"
																key={day}
																style={{
																	left: day * DAY_WIDTH,
																	width: DAY_WIDTH,
																}}
															/>
														))}
														{taskLayout ? (
															<Tooltip>
																<TooltipTrigger
																	className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-blue-500/70"
																	style={{
																		height: 16,
																		left: taskLayout.startOffset * DAY_WIDTH,
																		width: taskLayout.durationDays * DAY_WIDTH,
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
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
