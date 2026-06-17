import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseOrderTaskName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Order task name is required',
		});
	}
	return trimmed;
}

export function parseOrderTaskDurationDays(days: number): number {
	if (!Number.isInteger(days) || days < 1) {
		throw new ConvexError({
			code: 'INVALID_DURATION',
			message: 'Duration must be at least 1 day',
		});
	}
	return days;
}

export async function getProjectOrderTaskOrThrow(
	ctx: MutationCtx | QueryCtx,
	orderTaskId: Id<'projectOrderTasks'>
) {
	const orderTask = await ctx.db.get(orderTaskId);
	if (!orderTask) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Order task not found',
		});
	}
	return orderTask;
}
