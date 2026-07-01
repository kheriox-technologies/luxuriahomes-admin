import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Marks a lead as read or unread.
 */
export const updateReadStatus = mutation({
	args: {
		leadId: v.id('leads'),
		read: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const lead = await ctx.db.get(args.leadId);
		if (!lead) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Lead not found',
			});
		}
		await ctx.db.patch(args.leadId, { read: args.read });
		return args.leadId;
	},
});
