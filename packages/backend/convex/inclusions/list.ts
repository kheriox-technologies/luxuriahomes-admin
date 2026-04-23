import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {
		categoryId: v.optional(v.id('inclusionCategories')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const categoryId = args.categoryId;
		const rows =
			categoryId !== undefined
				? await ctx.db
						.query('inclusions')
						.withIndex('by_category', (q) => q.eq('categoryId', categoryId))
						.collect()
				: await ctx.db.query('inclusions').order('desc').collect();
		return rows.sort((a, b) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
		);
	},
});
