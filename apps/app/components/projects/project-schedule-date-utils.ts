import type { Doc } from '@workspace/backend/dataModel';
import { businessDayToCalendarOffset } from '@/components/schedules/schedule-calendar-utils';
import { computeLayouts } from '@/components/schedules/schedule-dependency-algorithm';

export function addCalendarDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function dateToCalOffset(date: Date, anchor: Date): number {
	const MS_PER_DAY = 86_400_000;
	return Math.round((date.getTime() - anchor.getTime()) / MS_PER_DAY);
}

export function addBusinessDays(date: Date, days: number): Date {
	if (days === 0) {
		return new Date(date);
	}
	const result = new Date(date);
	let added = 0;
	const dir = days >= 0 ? 1 : -1;
	while (added < Math.abs(days)) {
		result.setDate(result.getDate() + dir);
		const dow = result.getDay();
		if (dow !== 0 && dow !== 6) {
			added++;
		}
	}
	return result;
}

export function snapToWeekday(date: Date): Date {
	const d = new Date(date);
	const dow = d.getDay();
	if (dow === 6) {
		d.setDate(d.getDate() + 2); // Saturday → Monday
	}
	if (dow === 0) {
		d.setDate(d.getDate() + 1); // Sunday → Monday
	}
	return d;
}

export function templateOffsetToDate(
	bizDayOffset: number,
	projectStartDate: Date
): Date {
	const calOffset = businessDayToCalendarOffset(bizDayOffset, projectStartDate);
	return addCalendarDays(projectStartDate, calOffset);
}

export function startOfDay(date: Date): Date {
	// Use the local year/month/day but anchor to midnight UTC so that
	// server-side addBusinessDaysToTimestamp (which uses UTC getDay())
	// and client-side getDay() both agree on the calendar day.
	return new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
	);
}

export interface ProjectStageDate {
	endDate: number;
	startDate: number;
	templateStageId: string;
}

export interface ProjectTaskDate {
	endDate: number;
	startDate: number;
	templateTaskId: string;
}

export function computeProjectScheduleDates(
	stages: Doc<'scheduleStages'>[],
	tasks: Doc<'scheduleTasks'>[],
	projectStartDate: Date
): {
	stageDates: Map<string, { startDate: number; endDate: number }>;
	taskDates: Map<string, { startDate: number; endDate: number }>;
} {
	const anchor = startOfDay(projectStartDate);
	const { stageLayouts, taskLayouts } = computeLayouts(stages, tasks);

	// Use MONDAY_ANCHOR for computing template offsets to calendar offsets,
	// then re-anchor to the project start date.
	// The template offsets are relative business-day counts from day 0.
	// We convert them using the projectStartDate as the anchor.

	const stageDates = new Map<string, { startDate: number; endDate: number }>();
	for (const [stageId, layout] of stageLayouts) {
		const startCalOffset = businessDayToCalendarOffset(
			layout.startOffset,
			anchor
		);
		const endCalOffset = businessDayToCalendarOffset(layout.endOffset, anchor);
		stageDates.set(stageId, {
			startDate: addCalendarDays(anchor, startCalOffset).getTime(),
			endDate: addCalendarDays(anchor, endCalOffset).getTime(),
		});
	}

	const taskDates = new Map<string, { startDate: number; endDate: number }>();
	for (const [taskId, layout] of taskLayouts) {
		const startCalOffset = businessDayToCalendarOffset(
			layout.startOffset,
			anchor
		);
		// endOffset = startOffset + durationDays - 1 (last business day)
		const endCalOffset = businessDayToCalendarOffset(
			layout.startOffset + layout.durationDays - 1,
			anchor
		);
		taskDates.set(taskId, {
			startDate: addCalendarDays(anchor, startCalOffset).getTime(),
			endDate: addCalendarDays(anchor, endCalOffset).getTime(),
		});
	}

	return { stageDates, taskDates };
}

// Business days count between two dates (inclusive)
export function countBusinessDaysBetween(start: Date, end: Date): number {
	if (end < start) {
		return 1;
	}
	let count = 0;
	const d = new Date(start);
	while (d <= end) {
		const dow = d.getDay();
		if (dow !== 0 && dow !== 6) {
			count++;
		}
		d.setDate(d.getDate() + 1);
	}
	return Math.max(1, count);
}

export function formatProjectDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}
