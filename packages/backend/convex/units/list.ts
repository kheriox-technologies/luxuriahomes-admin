import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: { category: v.optional(v.string()) },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		if (args.category) {
			return await ctx.db
				.query('units')
				.withIndex('by_category', (q) =>
					q.eq('category', args.category as string)
				)
				.collect();
		}
		return await ctx.db.query('units').collect();
	},
});
