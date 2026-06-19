import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const setClientPortalVisibility = mutation({
	args: {
		documentId: v.id('projectDocuments'),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get(args.documentId);
		if (!doc) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Document not found',
			});
		}
		await ctx.db.patch(args.documentId, {
			clientPortalVisible: args.visible,
		});
		return args.documentId;
	},
});
