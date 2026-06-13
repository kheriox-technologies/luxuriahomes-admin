'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { useMemo } from 'react';
import type { StageLayout, TaskLayout } from './schedule-dependency-algorithm';
import { STAGE_ROW_HEIGHT, TASK_ROW_HEIGHT } from './schedule-row-heights';

const DAY_WIDTH = 44;
const MIN_DAYS = 20;

function getDayLabel(today: Date, offset: number): { day: string; month: string } {
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
}: {
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	stageLayouts: Map<string, StageLayout>;
	taskLayouts: Map<string, TaskLayout>;
}) {
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

	return (
		<div className="flex-1 overflow-auto">
			<div style={{ minWidth: gridWidth, position: 'relative' }}>
				{/* Header row */}
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
								<span className="font-medium leading-tight">{dayNum}</span>
								<span className="leading-tight opacity-70">{month}</span>
							</div>
						);
					})}
				</div>

				{/* Gantt rows */}
				{stages.map((stage, stageIndex) => {
					const stageLayout = stageLayouts.get(stage._id);
					const stageTasks = tasksByStage.get(stage._id) ?? [];
					const isEven = stageIndex % 2 === 0;

					return (
						<div key={stage._id}>
							{/* Stage bar row */}
							<div
								className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
								style={{ height: STAGE_ROW_HEIGHT, width: gridWidth }}
							>
								{/* Column grid lines */}
								{dayOffsets.map((day) => (
									<div
										className="absolute inset-y-0 border-border/30 border-r"
										key={day}
										style={{ left: day * DAY_WIDTH, width: DAY_WIDTH }}
									/>
								))}
								{stageLayout &&
								stageLayout.endOffset >= stageLayout.startOffset ? (
									<div
										className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-emerald-500/70"
										style={{
											height: 8,
											left: stageLayout.startOffset * DAY_WIDTH,
											width:
												(stageLayout.endOffset - stageLayout.startOffset + 1) *
												DAY_WIDTH,
										}}
									/>
								) : null}
							</div>

							{/* Task bar rows */}
							{stageTasks.map((task) => {
								const taskLayout = taskLayouts.get(task._id);
								return (
									<div
										className={`relative border-b ${isEven ? 'bg-muted/20' : ''}`}
										key={task._id}
										style={{ height: TASK_ROW_HEIGHT, width: gridWidth }}
									>
										{dayOffsets.map((day) => (
											<div
												className="absolute inset-y-0 border-border/30 border-r"
												key={day}
												style={{ left: day * DAY_WIDTH, width: DAY_WIDTH }}
											/>
										))}
										{taskLayout ? (
											<div
												className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-blue-500/70"
												style={{
													height: 16,
													left: taskLayout.startOffset * DAY_WIDTH,
													width: taskLayout.durationDays * DAY_WIDTH,
												}}
											/>
										) : null}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}
