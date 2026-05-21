import type { Doc, Id } from '@workspace/backend/dataModel';

export type Stage = Doc<'stages'>;
export type Task = Doc<'tasks'>;

export interface StageWithTasks {
	stage: Stage;
	tasks: Task[];
}

export interface StagePosition {
	endDay: number;
	startDay: number;
}

export interface TaskPosition {
	endDay: number;
	startDay: number;
}

function topoSort<T extends { _id: Id<'stages'> | Id<'tasks'> }>(
	items: T[],
	getDeps: (item: T) => string[]
): T[] {
	const idToItem = new Map<string, T>(items.map((i) => [i._id, i]));
	const visited = new Set<string>();
	const result: T[] = [];

	function visit(id: string) {
		if (visited.has(id)) {
			return;
		}
		visited.add(id);
		const item = idToItem.get(id);
		if (!item) {
			return;
		}
		for (const depId of getDeps(item)) {
			visit(depId);
		}
		result.push(item);
	}

	for (const item of items) {
		visit(item._id);
	}

	return result;
}

export function computeStagePositions(
	stages: Stage[]
): Map<Id<'stages'>, StagePosition> {
	const positions = new Map<Id<'stages'>, StagePosition>();

	const sorted = topoSort(stages, (s) => s.dependsOn.map((d) => d.stageId));

	for (const stage of sorted) {
		let startDay = 0;

		for (const dep of stage.dependsOn) {
			const depPos = positions.get(dep.stageId);
			if (!depPos) {
				continue;
			}
			if (dep.type === 'after') {
				startDay = Math.max(startDay, depPos.endDay);
			} else {
				// 'alongWith': start at same time as dep
				startDay = Math.max(startDay, depPos.startDay);
			}
		}

		const duration = Math.max(stage.totalDuration, 1);
		positions.set(stage._id, {
			startDay,
			endDay: startDay + duration,
		});
	}

	return positions;
}

export function computeTaskPositions(
	tasks: Task[],
	stageStartDay: number
): Map<Id<'tasks'>, TaskPosition> {
	const positions = new Map<Id<'tasks'>, TaskPosition>();

	const sorted = topoSort(tasks, (t) => t.dependsOn.map((d) => d.taskId));

	for (const task of sorted) {
		let startDay = stageStartDay;

		for (const dep of task.dependsOn) {
			const depPos = positions.get(dep.taskId);
			if (!depPos) {
				continue;
			}
			if (dep.type === 'after') {
				startDay = Math.max(startDay, depPos.endDay);
			} else {
				startDay = Math.max(startDay, depPos.startDay);
			}
		}

		const duration = Math.max(task.duration, 1);
		positions.set(task._id, {
			startDay,
			endDay: startDay + duration,
		});
	}

	return positions;
}

export function getTotalDays(
	stagePositions: Map<Id<'stages'>, StagePosition>,
	taskPositions: Map<Id<'tasks'>, TaskPosition>
): number {
	let max = 14;
	for (const pos of stagePositions.values()) {
		max = Math.max(max, pos.endDay);
	}
	for (const pos of taskPositions.values()) {
		max = Math.max(max, pos.endDay);
	}
	return max + 5;
}

export function toDayLabel(dayIndex: number): string {
	return `Day ${dayIndex + 1}`;
}

export const STAGE_COLORS = [
	{
		row: 'rgba(239,68,68,0.18)',
		taskRow: 'rgba(239,68,68,0.09)',
		connector: 'rgba(239,68,68,0.85)',
	},
	{
		row: 'rgba(249,115,22,0.18)',
		taskRow: 'rgba(249,115,22,0.09)',
		connector: 'rgba(249,115,22,0.85)',
	},
	{
		row: 'rgba(234,179,8,0.18)',
		taskRow: 'rgba(234,179,8,0.09)',
		connector: 'rgba(234,179,8,0.85)',
	},
	{
		row: 'rgba(34,197,94,0.18)',
		taskRow: 'rgba(34,197,94,0.09)',
		connector: 'rgba(34,197,94,0.85)',
	},
	{
		row: 'rgba(20,184,166,0.18)',
		taskRow: 'rgba(20,184,166,0.09)',
		connector: 'rgba(20,184,166,0.85)',
	},
	{
		row: 'rgba(59,130,246,0.18)',
		taskRow: 'rgba(59,130,246,0.09)',
		connector: 'rgba(59,130,246,0.85)',
	},
	{
		row: 'rgba(99,102,241,0.18)',
		taskRow: 'rgba(99,102,241,0.09)',
		connector: 'rgba(99,102,241,0.85)',
	},
	{
		row: 'rgba(168,85,247,0.18)',
		taskRow: 'rgba(168,85,247,0.09)',
		connector: 'rgba(168,85,247,0.85)',
	},
	{
		row: 'rgba(236,72,153,0.18)',
		taskRow: 'rgba(236,72,153,0.09)',
		connector: 'rgba(236,72,153,0.85)',
	},
] as const;
