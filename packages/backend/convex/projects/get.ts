import { v } from 'convex/values';
import { internalQuery, query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db.get(args.projectId);
	},
});

/**
 * Internal, auth-free project lookup for scheduled/background actions (e.g. the
 * Xero bill forwarder, which needs the project name for the email subject).
 */
export const getInternal = internalQuery({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => await ctx.db.get(args.projectId),
});
