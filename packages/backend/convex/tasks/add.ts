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
		const assigneeUserId = args.assigneeUserId?.trim() || undefined;
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
			order: await nextOrderForStatus(ctx, status),
			createdBy: addedByFromIdentity(identity),
			searchText,
		});
	},
});
