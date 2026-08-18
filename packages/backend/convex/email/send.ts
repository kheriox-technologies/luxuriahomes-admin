'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity } from '../projectOrders/shared';
import { deliverEmail, deliverEmailArgs } from './sendShared';

export const send = action({
	args: deliverEmailArgs,
	returns: v.object({ messageId: v.string(), threadId: v.string() }),
	handler: async (
		ctx,
		args
	): Promise<{ messageId: string; threadId: string }> => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		return await deliverEmail(ctx, {
			...args,
			sentBy: addedByFromIdentity(identity),
		});
	},
});
