import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseOrderName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Order name is required',
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

export async function getOrderOrThrow(
	ctx: MutationCtx | QueryCtx,
	orderId: Id<'orders'>
) {
	const order = await ctx.db.get(orderId);
	if (!order) {
		throw new ConvexError({ code: 'NOT_FOUND', message: 'Order not found' });
	}
	return order;
}

export async function validateTaskBelongsToStage(
	ctx: MutationCtx,
	stageId: Id<'stages'>,
	taskId: Id<'tasks'>
) {
	const task = await ctx.db.get(taskId);
	if (!task) {
		throw new ConvexError({ code: 'NOT_FOUND', message: 'Task not found' });
	}
	if (task.stageId !== stageId) {
		throw new ConvexError({
			code: 'TASK_STAGE_MISMATCH',
			message: 'The specified task does not belong to the specified stage',
		});
	}
}
