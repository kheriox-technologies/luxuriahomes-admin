'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMemo } from 'react';
import {
	getTotalDays,
	STAGE_COLORS,
	type StagePosition,
	type StageWithTasks,
	type TaskPosition,
	toDayLabel,
} from '@/components/stages/gantt-utils';
import StageRow from '@/components/stages/stage-row';
import TaskRow from '@/components/stages/task-row';

const COL_WIDTH = 56;
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 30;

interface GanttTableProps {
	allOrders: Doc<'orders'>[];
	stagePositions: Map<Id<'stages'>, StagePosition>;
	stagesWithTasks: StageWithTasks[];
	taskPositions: Map<Id<'tasks'>, TaskPosition>;
}

type FlatRow =
	| {
			colorIndex: number;
			kind: 'stage';
			pos: StagePosition;
			stage: Doc<'stages'>;
	  }
	| {
			colorIndex: number;
			kind: 'task';
			pos: TaskPosition;
			task: Doc<'tasks'>;
	  };

function rowId(row: FlatRow): string {
	return row.kind === 'stage'
		? `stage-${row.stage._id}`
		: `task-${row.task._id}`;
}

function DayHeader({ totalDays }: { totalDays: number }) {
	const labels = Array.from({ length: totalDays }, (_, i) => toDayLabel(i));
	return (
		<div
			className="sticky top-0 z-20 flex border-b bg-background"
			style={{ height: HEADER_HEIGHT }}
		>
			{labels.map((label) => (
				<div
					className="flex shrink-0 items-center justify-center border-r text-muted-foreground text-xs"
					key={label}
					style={{ height: HEADER_HEIGHT, width: COL_WIDTH }}
				>
					{label}
				</div>
			))}
		</div>
	);
}

function GanttRow({ row }: { row: FlatRow }) {
	const colors = STAGE_COLORS[row.colorIndex % STAGE_COLORS.length];
	const bgColor = row.kind === 'stage' ? colors.row : colors.taskRow;
	const left = row.pos.startDay * COL_WIDTH;
	const width = (row.pos.endDay - row.pos.startDay) * COL_WIDTH;

	return (
		<div className="relative border-b" style={{ height: ROW_HEIGHT }}>
			<div
				className="absolute top-1.5 bottom-1.5 rounded"
				style={{ background: bgColor, left, width }}
			/>
		</div>
	);
}

export default function GanttTable({
	stagesWithTasks,
	stagePositions,
	taskPositions,
	allOrders,
}: GanttTableProps) {
	const flatRows = useMemo<FlatRow[]>(() => {
		const rows: FlatRow[] = [];
		for (const [i, { stage, tasks }] of stagesWithTasks.entries()) {
			const pos = stagePositions.get(stage._id) ?? { startDay: 0, endDay: 0 };
			rows.push({ kind: 'stage', stage, colorIndex: i, pos });
			for (const task of tasks) {
				const taskPos = taskPositions.get(task._id) ?? {
					startDay: 0,
					endDay: 0,
				};
				rows.push({ kind: 'task', task, colorIndex: i, pos: taskPos });
			}
		}
		return rows;
	}, [stagesWithTasks, stagePositions, taskPositions]);

	const totalDays = useMemo(
		() => getTotalDays(stagePositions, taskPositions),
		[stagePositions, taskPositions]
	);

	if (stagesWithTasks.length === 0) {
		return null;
	}

	return (
		<div className="flex overflow-hidden rounded-lg border">
			{/* Left sticky name column */}
			<div className="z-10 flex w-72 shrink-0 flex-col border-r bg-background">
				<div
					className="flex items-center border-b px-3 font-medium text-muted-foreground text-xs"
					style={{ height: HEADER_HEIGHT }}
				>
					Stage / Task
				</div>
				{stagesWithTasks.map(({ stage, tasks }) => (
					<div key={stage._id}>
						<StageRow allOrders={allOrders} stage={stage} />
						{tasks.map((task) => (
							<TaskRow allOrders={allOrders} key={task._id} task={task} />
						))}
					</div>
				))}
			</div>

			{/* Right scrollable grid */}
			<div className="min-w-0 flex-1 overflow-x-auto">
				<div
					className="relative"
					style={{
						backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${COL_WIDTH - 1}px, color-mix(in srgb, currentColor 10%, transparent) ${COL_WIDTH - 1}px, color-mix(in srgb, currentColor 10%, transparent) ${COL_WIDTH}px)`,
						width: totalDays * COL_WIDTH,
					}}
				>
					<DayHeader totalDays={totalDays} />
					{flatRows.map((row) => (
						<GanttRow key={rowId(row)} row={row} />
					))}
				</div>
			</div>
		</div>
	);
}
