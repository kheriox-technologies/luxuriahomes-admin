import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { ensureCategoryNameUnique, parseCategoryName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseCategoryName(args.name);
		await ensureCategoryNameUnique(ctx, name);
		return await ctx.db.insert('inclusionCategories', {
			name,
			count: 0,
		});
	},
});
