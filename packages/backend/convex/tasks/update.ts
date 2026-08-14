import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { taskStatusValidator } from '../schema';
import {
	buildTaskSearchText,
	getVisibleTaskOrThrow,
	nextOrderForStatus,
} from './shared';

export const update = mutation({
	args: {
		taskId: v.id('tasks'),
		title: v.string(),
		description: v.optional(v.string()),
		status: taskStatusValidator,
		dueDate: v.optional(v.number()),
		projectId: v.optional(v.id('projects')),
		assigneeUserId: v.optional(v.string()),
		isPrivate: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getVisibleTaskOrThrow(
			ctx,
			args.taskId,
			identity.subject
		);
		const title = args.title.trim();
		if (title === '') {
			throw new ConvexError({
				code: 'INVALID_TITLE',
				message: 'Title cannot be empty',
			});
		}
		const description = args.description?.trim() || undefined;
		// See add.ts: a private task is always assigned to the caller. Unchecking
		// private simply makes it public, keeping the assignee the form supplied.
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
		// When the status changes via the edit form, move the card to the end of
		// its new lane; otherwise keep its current position.
		const order =
			args.status === existing.status
				? existing.order
				: await nextOrderForStatus(ctx, args.status);
		await ctx.db.patch(args.taskId, {
			title,
			description,
			status: args.status,
			dueDate: args.dueDate,
			projectId: args.projectId,
			assigneeUserId,
			isPrivate,
			order,
			searchText,
		});
		return args.taskId;
	},
});
