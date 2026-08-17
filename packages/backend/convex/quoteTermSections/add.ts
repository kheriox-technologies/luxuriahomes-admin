import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { createQuoteTermSection } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await createQuoteTermSection(ctx, args.name);
	},
});
