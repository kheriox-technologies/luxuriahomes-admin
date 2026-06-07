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

export function parseDescription(
	description: string | undefined
): string | undefined {
	if (description === undefined) {
		return undefined;
	}
	const trimmed = description.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

export function parseDuration(duration: number): number {
	if (!Number.isFinite(duration) || duration < 0) {
		throw new ConvexError({
			code: 'INVALID_DURATION',
			message: 'Duration must be a non-negative number',
		});
	}
	return Math.floor(duration);
}

export async function getTaskOrThrow(
	ctx: MutationCtx | QueryCtx,
	taskId: Id<'tasks'>
) {
	const task = await ctx.db.get(taskId);
	if (!task) {
		throw new ConvexError({ code: 'NOT_FOUND', message: 'Task not found' });
	}
	return task;
}

export async function syncStageCounters(
	ctx: MutationCtx,
	stageId: Id<'stages'>
) {
	const stage = await ctx.db.get(stageId);
	if (!stage) {
		return;
	}

	const tasks = await ctx.db
		.query('tasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();

	await ctx.db.patch(stageId, {
		taskCount: tasks.length,
		totalDuration: tasks.reduce((sum, t) => sum + t.duration, 0),
	});
}

export async function nextDisplayOrderForStage(
	ctx: MutationCtx,
	stageId: Id<'stages'>
): Promise<number> {
	const tasks = await ctx.db
		.query('tasks')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();
	if (tasks.length === 0) {
		return 0;
	}
	return Math.max(...tasks.map((t) => t.displayOrder)) + 1;
}
