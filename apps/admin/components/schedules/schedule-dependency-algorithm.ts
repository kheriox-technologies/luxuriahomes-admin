export interface StageInput {
	_id: string;
	dependencyStageId?: string;
	dependencyType?: 'startAfter' | 'startWith';
	order: number;
}

export interface TaskInput {
	_id: string;
	dependencyTaskId?: string;
	dependencyType?: 'startAfter' | 'startWith';
	durationDays: number;
	order: number;
	stageId: string;
}

export interface TaskLayout {
	durationDays: number;
	stageId: string;
	startOffset: number;
	taskId: string;
}

export interface StageLayout {
	endOffset: number;
	stageId: string;
	startOffset: number;
}

function topologicalSort<T extends { _id: string }>(
	items: T[],
	getDep: (item: T) => string | undefined
): T[] {
	const byId = new Map(items.map((i) => [i._id, i]));
	const inDegree = new Map(items.map((i) => [i._id, 0]));
	const children = new Map<string, string[]>(items.map((i) => [i._id, []]));

	for (const item of items) {
		const dep = getDep(item);
		if (dep && byId.has(dep)) {
			inDegree.set(item._id, (inDegree.get(item._id) ?? 0) + 1);
			children.get(dep)?.push(item._id);
		}
	}

	const queue = items.filter((i) => (inDegree.get(i._id) ?? 0) === 0);
	const sorted: T[] = [];

	while (queue.length > 0) {
		const node = queue.shift();
		if (!node) {
			break;
		}
		sorted.push(node);
		for (const childId of children.get(node._id) ?? []) {
			const deg = (inDegree.get(childId) ?? 1) - 1;
			inDegree.set(childId, deg);
			if (deg === 0) {
				const child = byId.get(childId);
				if (child) {
					queue.push(child);
				}
			}
		}
	}

	// Append any remaining items (cycle detection — assign offset 0)
	for (const item of items) {
		if (!sorted.includes(item)) {
			sorted.push(item);
		}
	}

	return sorted;
}

export function computeLayouts(
	stages: StageInput[],
	tasks: TaskInput[]
): {
	stageLayouts: Map<string, StageLayout>;
	taskLayouts: Map<string, TaskLayout>;
} {
	const tasksByStage = new Map<string, TaskInput[]>();
	for (const stage of stages) {
		tasksByStage.set(stage._id, []);
	}
	for (const task of tasks) {
		const list = tasksByStage.get(task.stageId);
		if (list) {
			list.push(task);
		}
	}

	// Compute relative task offsets within each stage (assuming stage starts at 0)
	const taskRelativeOffset = new Map<string, number>();
	for (const stageTasks of tasksByStage.values()) {
		const sorted = topologicalSort(stageTasks, (t) => t.dependencyTaskId);
		const offsets = new Map<string, number>();
		for (const task of sorted) {
			if (task.dependencyTaskId && offsets.has(task.dependencyTaskId)) {
				const depOffset = offsets.get(task.dependencyTaskId) ?? 0;
				const depTask = stageTasks.find((t) => t._id === task.dependencyTaskId);
				const depDuration = depTask?.durationDays ?? 0;
				offsets.set(
					task._id,
					task.dependencyType === 'startWith'
						? depOffset
						: depOffset + depDuration
				);
			} else {
				offsets.set(task._id, 0);
			}
		}
		for (const [id, offset] of offsets) {
			taskRelativeOffset.set(id, offset);
		}
	}

	// Compute stage duration from task relative offsets + durations
	const stageDuration = new Map<string, number>();
	for (const [stageId, stageTasks] of tasksByStage) {
		if (stageTasks.length === 0) {
			stageDuration.set(stageId, 0);
		} else {
			let maxEnd = 0;
			for (const task of stageTasks) {
				const end = (taskRelativeOffset.get(task._id) ?? 0) + task.durationDays;
				if (end > maxEnd) {
					maxEnd = end;
				}
			}
			stageDuration.set(stageId, maxEnd);
		}
	}

	// Compute stage absolute start offsets (topological order)
	const sortedStages = topologicalSort(stages, (s) => s.dependencyStageId);
	const stageAbsoluteStart = new Map<string, number>();
	for (const stage of sortedStages) {
		if (stage.dependencyStageId) {
			const depStart = stageAbsoluteStart.get(stage.dependencyStageId) ?? 0;
			const depDuration = stageDuration.get(stage.dependencyStageId) ?? 0;
			stageAbsoluteStart.set(
				stage._id,
				stage.dependencyType === 'startWith' ? depStart : depStart + depDuration
			);
		} else {
			stageAbsoluteStart.set(stage._id, 0);
		}
	}

	// Build final layouts
	const taskLayouts = new Map<string, TaskLayout>();
	for (const task of tasks) {
		const stageStart = stageAbsoluteStart.get(task.stageId) ?? 0;
		const relOffset = taskRelativeOffset.get(task._id) ?? 0;
		taskLayouts.set(task._id, {
			taskId: task._id,
			stageId: task.stageId,
			startOffset: stageStart + relOffset,
			durationDays: task.durationDays,
		});
	}

	const stageLayouts = new Map<string, StageLayout>();
	for (const stage of stages) {
		const stageTasks = tasksByStage.get(stage._id) ?? [];
		const stageStart = stageAbsoluteStart.get(stage._id) ?? 0;

		if (stageTasks.length === 0) {
			stageLayouts.set(stage._id, {
				stageId: stage._id,
				startOffset: stageStart,
				endOffset: stageStart,
			});
		} else {
			let minStart = Number.POSITIVE_INFINITY;
			let maxEnd = 0;
			for (const task of stageTasks) {
				const layout = taskLayouts.get(task._id);
				if (!layout) {
					continue;
				}
				if (layout.startOffset < minStart) {
					minStart = layout.startOffset;
				}
				const end = layout.startOffset + layout.durationDays - 1;
				if (end > maxEnd) {
					maxEnd = end;
				}
			}
			stageLayouts.set(stage._id, {
				stageId: stage._id,
				startOffset:
					minStart === Number.POSITIVE_INFINITY ? stageStart : minStart,
				endOffset: maxEnd,
			});
		}
	}

	return { stageLayouts, taskLayouts };
}
