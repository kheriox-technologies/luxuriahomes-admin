import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialColorOrThrow } from './shared';

export const remove = mutation({
	args: {
		materialColorId: v.id('materialColors'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getMaterialColorOrThrow(ctx, args.materialColorId);
		await ctx.db.delete(args.materialColorId);
		return args.materialColorId;
	},
});
