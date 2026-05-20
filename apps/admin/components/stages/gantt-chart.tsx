'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import { useEffect, useMemo, useRef } from 'react';
import {
	differenceInDays,
	type FrappeTask,
	GANTT_EPOCH,
	STAGE_COLORS,
	type StagePosition,
	stageToFrappeTask,
	type TaskPosition,
	taskToFrappeTask,
} from '@/components/stages/gantt-utils';
import StageRow from '@/components/stages/stage-row';
import TaskRow from '@/components/stages/task-row';

import '@/components/stages/frappe-gantt.css';

type Stage = Doc<'stages'>;
type Task = Doc<'tasks'>;

const BAR_HEIGHT = 22;
const PADDING = 18;
const UPPER_HEADER_HEIGHT = 45;
const LOWER_HEADER_HEIGHT = 30;
const TOTAL_HEADER_HEIGHT = UPPER_HEADER_HEIGHT + LOWER_HEADER_HEIGHT;

export interface StageWithTasks {
	stage: Stage;
	tasks: Task[];
}

interface GanttChartProps {
	allOrders: Doc<'orders'>[];
	stagePositions: Map<Id<'stages'>, StagePosition>;
	stagesWithTasks: StageWithTasks[];
	taskPositions: Map<Id<'tasks'>, TaskPosition>;
}

export default function GanttChart({
	stagesWithTasks,
	stagePositions,
	taskPositions,
	allOrders,
}: GanttChartProps) {
	const ganttRef = useRef<HTMLDivElement>(null);

	const frappeTasks = useMemo<FrappeTask[]>(() => {
		const tasks: FrappeTask[] = [];
		for (let i = 0; i < stagesWithTasks.length; i++) {
			const { stage, tasks: stageTasks } = stagesWithTasks[i];
			const stagePos = stagePositions.get(stage._id);
			if (stagePos) {
				tasks.push(stageToFrappeTask(stage, stagePos, i));
			}
			for (const task of stageTasks) {
				const taskPos = taskPositions.get(task._id);
				if (taskPos) {
					tasks.push(taskToFrappeTask(task, taskPos, i, stage._id));
				}
			}
		}
		return tasks;
	}, [stagesWithTasks, stagePositions, taskPositions]);

	useEffect(() => {
		if (!ganttRef.current || frappeTasks.length === 0) {
			return;
		}

		async function initGantt() {
			const GanttClass = (await import('frappe-gantt')).default;

			if (!ganttRef.current) {
				return;
			}

			ganttRef.current.innerHTML = '';

			const dayViewMode = {
				name: 'Day',
				padding: '0d',
				date_format: 'YYYY-MM-DD',
				step: '1d',
				column_width: 56,
				upper_text: () => '',
				lower_text: (d: Date) => {
					const day = differenceInDays(d, GANTT_EPOCH) + 1;
					return `Day ${day}`;
				},
				upper_text_frequency: 0,
			};

			new GanttClass(ganttRef.current, frappeTasks, {
				view_modes: [dayViewMode],
				view_mode: 'Day',
				bar_height: BAR_HEIGHT,
				padding: PADDING,
				upper_header_height: UPPER_HEADER_HEIGHT,
				lower_header_height: LOWER_HEADER_HEIGHT,
				column_width: 56,
				readonly: true,
				infinite_padding: false,
				popup_on: 'hover',
				show_bar_label: false,
				custom_popup_html: null,
			});
		}

		initGantt().catch(console.error);
	}, [frappeTasks]);

	if (stagesWithTasks.length === 0) {
		return null;
	}

	return (
		<div className="flex overflow-hidden rounded-lg border">
			{/* Left column — sticky name + action menu */}
			<div className="w-72 shrink-0 overflow-hidden border-r">
				{/* Header matching frappe-gantt total header height */}
				<div
					className="flex items-end border-b px-3 pb-2 font-medium text-muted-foreground text-xs"
					style={{ height: TOTAL_HEADER_HEIGHT }}
				>
					Stage / Task
				</div>
				{/* Stage + task rows */}
				{stagesWithTasks.map(({ stage, tasks }, i) => (
					<div key={stage._id}>
						<StageRow allOrders={allOrders} colorIndex={i} stage={stage} />
						{tasks.map((task) => (
							<TaskRow
								allOrders={allOrders}
								colorIndex={i}
								key={task._id}
								task={task}
							/>
						))}
					</div>
				))}
			</div>

			{/* Right: frappe-gantt */}
			<div className="min-w-0 flex-1 overflow-x-auto">
				<div className="gantt-wrapper" ref={ganttRef} />
			</div>

			{/* Gantt style overrides */}
			<style>{`
				.gantt-wrapper .gantt .lower-header {
					font-size: 11px;
				}
				.gantt-wrapper .gantt .upper-header {
					display: none;
				}
				${STAGE_COLORS.map(
					(_, idx) => `
				.gantt-wrapper .gantt-stage-${idx} .bar {
					fill: ${STAGE_COLORS[idx].bar};
					stroke: none;
				}
				.gantt-wrapper .gantt-task-${idx} .bar {
					fill: ${STAGE_COLORS[idx].taskRow};
					stroke: ${STAGE_COLORS[idx].bar};
					stroke-width: 1;
				}
				`
				).join('')}
			`}</style>
		</div>
	);
}
