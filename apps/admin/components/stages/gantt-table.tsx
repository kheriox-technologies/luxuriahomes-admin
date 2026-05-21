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

function rowCenterY(rowIndex: number): number {
	return HEADER_HEIGHT + rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
}

interface ConnectorPath {
	arrowhead: string;
	color: string;
	d: string;
	id: string;
}

function makeConnector(
	type: 'after' | 'alongWith',
	fromPos: StagePosition | TaskPosition,
	fromRowIndex: number,
	toPos: StagePosition | TaskPosition,
	toRowIndex: number,
	color: string,
	id: string
): ConnectorPath {
	const y1 = rowCenterY(fromRowIndex);
	const y2 = rowCenterY(toRowIndex);

	if (type === 'alongWith') {
		const x = fromPos.startDay * COL_WIDTH + 4;
		const arrowSign = y2 > y1 ? 1 : -1;
		return {
			id,
			color,
			d: `M ${x} ${y1} L ${x} ${y2}`,
			arrowhead: `M ${x - 4} ${y2 - arrowSign * 6} L ${x} ${y2} L ${x + 4} ${y2 - arrowSign * 6}`,
		};
	}

	const x1 = fromPos.endDay * COL_WIDTH;
	const x2 = toPos.startDay * COL_WIDTH;
	const xMid = x1 + Math.max(16, (x2 - x1) / 2);
	const r = 6;
	const goingDown = y2 > y1;
	const arcSweep1 = goingDown ? 1 : 0;
	const arcSweep2 = goingDown ? 0 : 1;
	const sign = goingDown ? 1 : -1;

	const d = [
		`M ${x1} ${y1}`,
		`H ${xMid - r}`,
		`A ${r} ${r} 0 0 ${arcSweep1} ${xMid} ${y1 + sign * r}`,
		`V ${y2 - sign * r}`,
		`A ${r} ${r} 0 0 ${arcSweep2} ${xMid - r} ${y2}`,
		`H ${x2}`,
	].join(' ');

	return {
		id,
		color,
		d,
		arrowhead: `M ${x2 + 8} ${y2 - 4} L ${x2} ${y2} L ${x2 + 8} ${y2 + 4}`,
	};
}

function buildStageDependencyPaths(
	flatRows: FlatRow[],
	rowIndexMap: Map<string, number>,
	stagesWithTasks: StageWithTasks[],
	stagePositions: Map<Id<'stages'>, StagePosition>
): ConnectorPath[] {
	const paths: ConnectorPath[] = [];
	for (const { stage } of stagesWithTasks) {
		const toPos = stagePositions.get(stage._id);
		if (!toPos) {
			continue;
		}
		const toRowIndex = rowIndexMap.get(stage._id);
		if (toRowIndex === undefined) {
			continue;
		}
		for (const dep of stage.dependsOn) {
			const fromPos = stagePositions.get(dep.stageId);
			if (!fromPos) {
				continue;
			}
			const fromRowIndex = rowIndexMap.get(dep.stageId);
			if (fromRowIndex === undefined) {
				continue;
			}
			const fromFlatRow = flatRows[fromRowIndex];
			const color =
				STAGE_COLORS[fromFlatRow.colorIndex % STAGE_COLORS.length].connector;
			paths.push(
				makeConnector(
					dep.type,
					fromPos,
					fromRowIndex,
					toPos,
					toRowIndex,
					color,
					`${dep.stageId}->${stage._id}`
				)
			);
		}
	}
	return paths;
}

function buildTaskDependencyPaths(
	flatRows: FlatRow[],
	rowIndexMap: Map<string, number>,
	stagesWithTasks: StageWithTasks[],
	taskPositions: Map<Id<'tasks'>, TaskPosition>
): ConnectorPath[] {
	const paths: ConnectorPath[] = [];
	for (const { tasks } of stagesWithTasks) {
		for (const task of tasks) {
			const toPos = taskPositions.get(task._id);
			if (!toPos) {
				continue;
			}
			const toRowIndex = rowIndexMap.get(task._id);
			if (toRowIndex === undefined) {
				continue;
			}
			for (const dep of task.dependsOn) {
				const fromPos = taskPositions.get(dep.taskId);
				if (!fromPos) {
					continue;
				}
				const fromRowIndex = rowIndexMap.get(dep.taskId);
				if (fromRowIndex === undefined) {
					continue;
				}
				const fromFlatRow = flatRows[fromRowIndex];
				const color =
					STAGE_COLORS[fromFlatRow.colorIndex % STAGE_COLORS.length].connector;
				paths.push(
					makeConnector(
						dep.type,
						fromPos,
						fromRowIndex,
						toPos,
						toRowIndex,
						color,
						`${dep.taskId}->${task._id}`
					)
				);
			}
		}
	}
	return paths;
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
				className="absolute top-0 bottom-0"
				style={{ background: bgColor, left, width }}
			/>
		</div>
	);
}

function ConnectorOverlay({
	flatRows,
	rowIndexMap,
	stagePositions,
	stagesWithTasks,
	taskPositions,
	totalDays,
}: {
	flatRows: FlatRow[];
	rowIndexMap: Map<string, number>;
	stagePositions: Map<Id<'stages'>, StagePosition>;
	stagesWithTasks: StageWithTasks[];
	taskPositions: Map<Id<'tasks'>, TaskPosition>;
	totalDays: number;
}) {
	const svgWidth = totalDays * COL_WIDTH;
	const svgHeight = HEADER_HEIGHT + flatRows.length * ROW_HEIGHT;

	const paths = useMemo(
		() => [
			...buildStageDependencyPaths(
				flatRows,
				rowIndexMap,
				stagesWithTasks,
				stagePositions
			),
			...buildTaskDependencyPaths(
				flatRows,
				rowIndexMap,
				stagesWithTasks,
				taskPositions
			),
		],
		[flatRows, rowIndexMap, stagesWithTasks, stagePositions, taskPositions]
	);

	if (paths.length === 0) {
		return null;
	}

	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none absolute top-0 left-0 z-10"
			height={svgHeight}
			overflow="visible"
			width={svgWidth}
		>
			{paths.map((p) => (
				<g key={p.id}>
					<path d={p.d} fill="none" stroke={p.color} strokeWidth={1.5} />
					<path
						d={p.arrowhead}
						fill="none"
						stroke={p.color}
						strokeWidth={1.5}
					/>
				</g>
			))}
		</svg>
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
				const tpos = taskPositions.get(task._id) ?? { startDay: 0, endDay: 0 };
				rows.push({ kind: 'task', task, colorIndex: i, pos: tpos });
			}
		}
		return rows;
	}, [stagesWithTasks, stagePositions, taskPositions]);

	const rowIndexMap = useMemo(() => {
		const m = new Map<string, number>();
		for (const [i, row] of flatRows.entries()) {
			m.set(row.kind === 'stage' ? row.stage._id : row.task._id, i);
		}
		return m;
	}, [flatRows]);

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
					<ConnectorOverlay
						flatRows={flatRows}
						rowIndexMap={rowIndexMap}
						stagePositions={stagePositions}
						stagesWithTasks={stagesWithTasks}
						taskPositions={taskPositions}
						totalDays={totalDays}
					/>
					{flatRows.map((row) => (
						<GanttRow key={rowId(row)} row={row} />
					))}
				</div>
			</div>
		</div>
	);
}
