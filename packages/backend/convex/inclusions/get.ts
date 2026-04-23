import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		inclusionId: v.id('inclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const inclusion = await ctx.db.get(args.inclusionId);
		if (!inclusion) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Inclusion not found',
			});
		}
		const variants = await ctx.db
			.query('inclusionVariants')
			.withIndex('by_inclusion', (q) => q.eq('inclusionId', args.inclusionId))
			.collect();
		variants.sort((a, b) => a.code.localeCompare(b.code));
		return { inclusion, variants };
	},
});
