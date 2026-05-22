'use client';

import type { Id } from '@workspace/backend/dataModel';
import Gantt, { type FrappeTask, type ViewModeConfig } from 'frappe-gantt';
import '@/components/stages/frappe-gantt-vendor.css';
import { useEffect, useMemo, useRef } from 'react';
import '@/components/stages/gantt-chart.css';
import {
	buildFrappeTasks,
	type StagePosition,
	type StageWithTasks,
	type TaskPosition,
} from '@/components/stages/gantt-utils';

interface GanttChartProps {
	stagePositions: Map<Id<'stages'>, StagePosition>;
	stagesWithTasks: StageWithTasks[];
	taskPositions: Map<Id<'tasks'>, TaskPosition>;
	viewMode?: 'Day' | 'Week' | 'Month';
}

const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const SHORT_MONTH_NAMES = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

function makeViewMode(name: 'Day' | 'Week' | 'Month'): ViewModeConfig {
	if (name === 'Day') {
		return {
			name: 'Day',
			padding: ['1d', '7d'],
			step: '1d',
			date_format: 'YYYY-MM-DD',
			lower_text: (d, ld) =>
				!ld || d.getDate() !== ld.getDate() ? String(d.getDate()) : '',
			upper_text: (d, ld) =>
				!ld || d.getMonth() !== ld.getMonth() ? MONTH_NAMES[d.getMonth()] : '',
			thick_line: (d) => d.getDay() === 1,
		};
	}
	if (name === 'Week') {
		return {
			name: 'Week',
			padding: ['7d', '7d'],
			step: '7d',
			date_format: 'YYYY-MM-DD',
			column_width: 140,
			upper_text_frequency: 4,
			lower_text: (d, ld) => {
				const end = new Date(d);
				end.setDate(d.getDate() + 6);
				const endStr =
					end.getMonth() !== d.getMonth()
						? `${end.getDate()} ${SHORT_MONTH_NAMES[end.getMonth()]}`
						: String(end.getDate());
				const startStr =
					!ld || d.getMonth() !== ld.getMonth()
						? `${d.getDate()} ${SHORT_MONTH_NAMES[d.getMonth()]}`
						: String(d.getDate());
				return `${startStr} - ${endStr}`;
			},
			upper_text: (d, ld) =>
				!ld || d.getMonth() !== ld.getMonth() ? MONTH_NAMES[d.getMonth()] : '',
			thick_line: (d) => d.getDate() >= 1 && d.getDate() <= 7,
		};
	}
	return {
		name: 'Month',
		padding: ['1m', '1m'],
		step: '1m',
		column_width: 120,
		date_format: 'YYYY-MM',
		lower_text: 'MMMM',
		upper_text: (d, ld) =>
			!ld || d.getFullYear() !== ld.getFullYear()
				? String(d.getFullYear())
				: '',
		thick_line: (d) => d.getMonth() % 3 === 0,
		snap_at: '7d',
	};
}

export default function GanttChart({
	stagesWithTasks,
	stagePositions,
	taskPositions,
	viewMode = 'Day',
}: GanttChartProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const ganttRef = useRef<Gantt | null>(null);

	const anchor = useMemo(() => new Date(), []);

	const tasks = useMemo(
		() =>
			buildFrappeTasks(stagesWithTasks, stagePositions, taskPositions, anchor),
		[stagesWithTasks, stagePositions, taskPositions, anchor]
	);

	useEffect(() => {
		if (!containerRef.current || tasks.length === 0) {
			return;
		}

		ganttRef.current?.clear();
		ganttRef.current = null;
		containerRef.current.innerHTML = '';

		const activeMode = makeViewMode(viewMode);

		ganttRef.current = new Gantt(containerRef.current, tasks as FrappeTask[], {
			view_modes: [activeMode],
			readonly: true,
			today_button: true,
			scroll_to: 'start',
			popup: false,
			bar_height: 28,
			padding: 14,
			container_height: 'auto',
			lines: 'both',
			holidays: {},
			ignore: [],
			infinite_padding: false,
		});

		return () => {
			ganttRef.current?.clear();
			ganttRef.current = null;
			if (containerRef.current) {
				containerRef.current.innerHTML = '';
			}
		};
	}, [tasks, viewMode]);

	if (tasks.length === 0) {
		return null;
	}

	return <div className="h-full w-full" ref={containerRef} />;
}
