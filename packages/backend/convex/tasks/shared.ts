import { ConvexError } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildSearchText } from '../lib/buildSearchText';

/**
 * Resolves the display name for the "added by" / "created by" fields from the
 * Clerk identity, falling back to email then a generic label.
 */
export function addedByFromIdentity(identity: {
	email?: string;
	name?: string;
}): string {
	const name = identity.name?.trim();
	if (name) {
		return name;
	}
	const email = identity.email?.trim();
	if (email) {
		return email;
	}
	return 'Unknown user';
}

/** Fetches a task by id or throws a NOT_FOUND ConvexError. */
export async function getTaskOrThrow(
	ctx: QueryCtx | MutationCtx,
	taskId: Id<'tasks'>
): Promise<Doc<'tasks'>> {
	const task = await ctx.db.get(taskId);
	if (!task) {
		throw new ConvexError({ code: 'NOT_FOUND', message: 'Task not found' });
	}
	return task;
}

/** Builds the denormalized search blob for a task. */
export async function buildTaskSearchText(
	ctx: QueryCtx | MutationCtx,
	fields: {
		title: string;
		description?: string;
		projectId?: Id<'projects'>;
		assigneeUserId?: string;
	}
): Promise<string> {
	let projectName: string | undefined;
	if (fields.projectId) {
		const project = await ctx.db.get(fields.projectId);
		projectName = project?.name;
	}
	let assigneeName: string | undefined;
	if (fields.assigneeUserId) {
		const admin = await ctx.db
			.query('adminUsers')
			.withIndex('by_user', (q) => q.eq('userId', fields.assigneeUserId ?? ''))
			.first();
		assigneeName = admin?.fullName;
	}
	return buildSearchText([
		fields.title,
		fields.description,
		projectName,
		assigneeName,
	]);
}

/** Returns the next order value for a status lane (max existing + 1). */
export async function nextOrderForStatus(
	ctx: QueryCtx | MutationCtx,
	status: Doc<'tasks'>['status']
): Promise<number> {
	const tasksInLane = await ctx.db
		.query('tasks')
		.withIndex('by_status', (q) => q.eq('status', status))
		.collect();
	return tasksInLane.reduce((max, t) => Math.max(max, t.order), 0) + 1;
}
