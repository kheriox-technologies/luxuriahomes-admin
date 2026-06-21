import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity, getTaskOrThrow } from './shared';

export const appendNote = mutation({
	args: {
		taskId: v.id('tasks'),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		await getTaskOrThrow(ctx, args.taskId);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		const images = args.images?.filter((key) => key.trim() !== '');
		await ctx.db.insert('taskNotes', {
			taskId: args.taskId,
			timestamp: Date.now(),
			addedBy: addedByFromIdentity(identity),
			note: trimmed,
			images: images && images.length > 0 ? images : undefined,
		});
		return args.taskId;
	},
});
