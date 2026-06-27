import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const rename = mutation({
	args: {
		takeoffId: v.id('takeoffs'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const trimmed = args.name.trim();
		if (!trimmed) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'Take-off name is required',
			});
		}
		await ctx.db.patch(args.takeoffId, {
			name: trimmed,
			updatedAt: Date.now(),
		});
	},
});
