import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';

export const getPendingBatch = internalQuery({
	args: { limit: v.number() },
	handler: async (ctx, args) => {
		const all = await ctx.db.query('projectInclusions').collect();
		return all
			.filter(
				(r) => typeof r.image === 'string' && r.image.startsWith('https://')
			)
			.slice(0, args.limit);
	},
});

export const patchImage = internalMutation({
	args: { id: v.id('projectInclusions'), image: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { image: args.image });
	},
});
