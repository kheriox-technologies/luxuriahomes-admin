import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseProjectTaskName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Task name is required',
		});
	}
	return trimmed;
}

export function parseProjectTaskDurationDays(days: number): number {
	if (!Number.isInteger(days) || days < 1) {
		throw new ConvexError({
			code: 'INVALID_DURATION',
			message: 'Duration must be at least 1 day',
		});
	}
	return days;
}

export async function getProjectTaskOrThrow(
	ctx: MutationCtx | QueryCtx,
	taskId: Id<'projectTasks'>
) {
	const task = await ctx.db.get(taskId);
	if (!task) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Task not found',
		});
	}
	return task;
}

export async function nextProjectTaskOrder(
	ctx: MutationCtx,
	stageId: Id<'projectStages'>
): Promise<number> {
	const existing = await ctx.db
		.query('projectTasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();
	return existing.length === 0
		? 0
		: Math.max(...existing.map((t) => t.order)) + 1;
}

const MS_PER_DAY = 86_400_000;

export function addBusinessDaysToTimestamp(
	timestamp: number,
	days: number
): number {
	if (days === 0) {
		return timestamp;
	}
	let result = timestamp;
	let added = 0;
	const dir = days >= 0 ? 1 : -1;
	while (added < Math.abs(days)) {
		result += dir * MS_PER_DAY;
		const dow = new Date(result).getDay();
		if (dow !== 0 && dow !== 6) {
			added++;
		}
	}
	return result;
}

// Count business days from one timestamp to another (signed: negative = backward).
export function businessDaysBetweenTimestamps(
	fromMs: number,
	toMs: number
): number {
	if (fromMs === toMs) {
		return 0;
	}
	const dir = toMs > fromMs ? 1 : -1;
	let count = 0;
	let current = fromMs;
	while (dir * (toMs - current) > 0) {
		current += dir * MS_PER_DAY;
		const dow = new Date(current).getDay();
		if (dow !== 0 && dow !== 6) {
			count++;
		}
	}
	return dir * count;
}

// After a task's dates change, shift any tasks in the same stage that depend on it.
export async function cascadeDependentTasks(
	ctx: MutationCtx,
	changedTaskId: Id<'projectTasks'>,
	stageId: Id<'projectStages'>
): Promise<void> {
	const changedTask = await ctx.db.get(changedTaskId);
	if (!changedTask) {
		return;
	}

	const stageTasks = await ctx.db
		.query('projectTasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();

	for (const task of stageTasks) {
		if (task.dependencyTaskId !== changedTaskId) {
			continue;
		}

		const offset = task.offsetDays ?? 0;
		const newStart =
			task.dependencyType === 'startWith'
				? addBusinessDaysToTimestamp(changedTask.startDate, offset)
				: addBusinessDaysToTimestamp(changedTask.endDate, 1 + offset);

		if (Math.abs(newStart - task.startDate) < 1000) {
			continue;
		}

		// Recompute endDate from durationDays so it always lands on a weekday.
		const newEnd = addBusinessDaysToTimestamp(newStart, task.durationDays - 1);
		await ctx.db.patch(task._id, { startDate: newStart, endDate: newEnd });
		await cascadeLinkedOrderDates(ctx, task._id, newStart);

		await cascadeDependentTasks(ctx, task._id, stageId);
	}
}

// When a task's startDate changes, update orderBy/deliverBy on any orders
// linked via the task's order task.
export async function cascadeLinkedOrderDates(
	ctx: MutationCtx,
	taskId: Id<'projectTasks'>,
	newStartDate: number
): Promise<void> {
	const orderTask = await ctx.db
		.query('projectOrderTasks')
		.withIndex('by_parent_task', (q) => q.eq('parentTaskId', taskId))
		.first();
	if (!orderTask) {
		return;
	}
	const deliverBy = addBusinessDaysToTimestamp(newStartDate, -1);
	const orderBy = addBusinessDaysToTimestamp(
		deliverBy,
		-(orderTask.durationDays - 1)
	);
	const linkedOrders = await ctx.db
		.query('projectOrders')
		.withIndex('by_order_task', (q) => q.eq('orderTaskId', orderTask._id))
		.collect();
	await Promise.all(
		linkedOrders.map((order) => ctx.db.patch(order._id, { orderBy, deliverBy }))
	);
}

// After a stage's dates change, shift any stages that depend on it (and all their tasks).
export async function cascadeDependentStages(
	ctx: MutationCtx,
	changedStageId: Id<'projectStages'>,
	projectId: Id<'projects'>
): Promise<void> {
	const changedStage = await ctx.db.get(changedStageId);
	if (!changedStage) {
		return;
	}

	const allStages = await ctx.db
		.query('projectStages')
		.withIndex('by_project', (q) => q.eq('projectId', projectId))
		.collect();

	for (const stage of allStages) {
		if (stage.dependencyStageId !== changedStageId) {
			continue;
		}

		const offset = stage.offsetDays ?? 0;
		const newStart =
			stage.dependencyType === 'startWith'
				? addBusinessDaysToTimestamp(changedStage.startDate, offset)
				: addBusinessDaysToTimestamp(changedStage.endDate, 1 + offset);

		if (Math.abs(newStart - stage.startDate) < 1000) {
			continue;
		}

		// Measure the shift in business days so task dates stay on weekdays.
		const bizDiff = businessDaysBetweenTimestamps(stage.startDate, newStart);

		// Shift every task in this stage by the same business-day amount.
		const tasks = await ctx.db
			.query('projectTasks')
			.withIndex('by_stage', (q) => q.eq('stageId', stage._id))
			.collect();
		let newStageEnd = newStart;
		for (const task of tasks) {
			const newTaskStart = addBusinessDaysToTimestamp(task.startDate, bizDiff);
			const newTaskEnd = addBusinessDaysToTimestamp(
				newTaskStart,
				task.durationDays - 1
			);
			await ctx.db.patch(task._id, {
				startDate: newTaskStart,
				endDate: newTaskEnd,
			});
			await cascadeLinkedOrderDates(ctx, task._id, newTaskStart);
			if (newTaskEnd > newStageEnd) {
				newStageEnd = newTaskEnd;
			}
		}

		await ctx.db.patch(stage._id, {
			startDate: newStart,
			endDate: newStageEnd,
		});

		await cascadeDependentStages(ctx, stage._id, projectId);
	}
}

export async function recalcStageDates(
	ctx: MutationCtx,
	stageId: Id<'projectStages'>
): Promise<void> {
	const tasks = await ctx.db
		.query('projectTasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();

	if (tasks.length === 0) {
		return;
	}

	const minStart = Math.min(...tasks.map((t) => t.startDate));
	const maxEnd = Math.max(...tasks.map((t) => t.endDate));

	await ctx.db.patch(stageId, { startDate: minStart, endDate: maxEnd });
}

export async function recalcStageStatus(
	ctx: MutationCtx,
	stageId: Id<'projectStages'>
): Promise<void> {
	const tasks = await ctx.db
		.query('projectTasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();

	if (tasks.length === 0) {
		return;
	}

	const allComplete = tasks.every((t) => t.status === 'Complete');
	const anyStarted = tasks.some(
		(t) => t.status === 'In Progress' || t.status === 'Complete'
	);

	let status: 'Complete' | 'In Progress' | 'Pending' = 'Pending';
	if (allComplete) {
		status = 'Complete';
	} else if (anyStarted) {
		status = 'In Progress';
	}

	await ctx.db.patch(stageId, { status });
}
