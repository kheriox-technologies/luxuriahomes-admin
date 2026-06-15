import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseTaskName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Task name is required',
		});
	}
	return trimmed;
}

export function parseTaskDurationDays(days: number): number {
	if (!Number.isInteger(days) || days < 1) {
		throw new ConvexError({
			code: 'INVALID_DURATION',
			message: 'Duration must be at least 1 day',
		});
	}
	return days;
}

export async function getTaskOrThrow(
	ctx: MutationCtx | QueryCtx,
	taskId: Id<'scheduleTasks'>
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

export async function nextTaskOrder(
	ctx: MutationCtx,
	stageId: Id<'scheduleStages'>
): Promise<number> {
	const existing = await ctx.db
		.query('scheduleTasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();
	return existing.length === 0
		? 0
		: Math.max(...existing.map((t) => t.order)) + 1;
}
