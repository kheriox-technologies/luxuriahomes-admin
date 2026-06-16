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
	const anyInProgress = tasks.some((t) => t.status === 'In Progress');

	let status: 'Complete' | 'In Progress' | 'Pending' = 'Pending';
	if (allComplete) {
		status = 'Complete';
	} else if (anyInProgress) {
		status = 'In Progress';
	}

	await ctx.db.patch(stageId, { status });
}
