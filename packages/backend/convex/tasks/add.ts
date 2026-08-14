import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { taskStatusValidator } from '../schema';
import {
	addedByFromIdentity,
	buildTaskSearchText,
	nextOrderForStatus,
} from './shared';

export const add = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		status: v.optional(taskStatusValidator),
		dueDate: v.optional(v.number()),
		projectId: v.optional(v.id('projects')),
		assigneeUserId: v.optional(v.string()),
		isPrivate: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const title = args.title.trim();
		if (title === '') {
			throw new ConvexError({
				code: 'INVALID_TITLE',
				message: 'Title cannot be empty',
			});
		}
		const status = args.status ?? 'planned';
		const description = args.description?.trim() || undefined;
		// A private task always belongs to its creator, so the client's assignee
		// choice is ignored: otherwise the task would be invisible to the person
		// it was assigned to.
		const isPrivate = args.isPrivate === true;
		const assigneeUserId = isPrivate
			? identity.subject
			: args.assigneeUserId?.trim() || undefined;
		const searchText = await buildTaskSearchText(ctx, {
			title,
			description,
			projectId: args.projectId,
			assigneeUserId,
		});
		return await ctx.db.insert('tasks', {
			title,
			description,
			status,
			dueDate: args.dueDate,
			projectId: args.projectId,
			assigneeUserId,
			isPrivate,
			order: await nextOrderForStatus(ctx, status),
			createdBy: addedByFromIdentity(identity),
			searchText,
		});
	},
});
