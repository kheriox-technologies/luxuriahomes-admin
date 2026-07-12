import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { createTrade } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		stageId: v.optional(v.id('tradeStages')),
		xeroAccountIds: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await createTrade(ctx, {
			name: args.name,
			description: args.description,
			stageId: args.stageId,
			xeroAccountIds: args.xeroAccountIds,
		});
	},
});
