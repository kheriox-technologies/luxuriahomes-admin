import { v } from 'convex/values';
import { query } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getVisibleTaskOrThrow } from './shared';

export const get = query({
	args: {
		taskId: v.id('tasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		return await getVisibleTaskOrThrow(ctx, args.taskId, identity.subject);
	},
});
