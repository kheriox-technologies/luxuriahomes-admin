import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity, getOrderOrThrow } from './shared';

export const appendNote = mutation({
	args: {
		orderId: v.id('projectOrders'),
		note: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		await getOrderOrThrow(ctx, args.orderId);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		const timestamp = Date.now();
		const addedBy = addedByFromIdentity(identity);
		await ctx.db.insert('projectOrderNotes', {
			orderId: args.orderId,
			timestamp,
			addedBy,
			note: trimmed,
		});
		return args.orderId;
	},
});
