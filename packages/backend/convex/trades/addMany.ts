import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { createTrade } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
		stageId: v.optional(v.id('tradeStages')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'trades'>[] = [];
		for (const raw of args.names) {
			ids.push(await createTrade(ctx, { name: raw, stageId: args.stageId }));
		}
		return ids;
	},
});
