'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { deliverEmail, deliverEmailArgs } from './sendShared';

/**
 * Sends a message on the system's own behalf, with no caller to authorize.
 *
 * `email.send.send` requires the admin role, which is right for anything a user
 * composes but wrong for mail the workflow raises itself — the signature
 * ceremony has to notify the office when the last client signs, and that client
 * is not an admin. Internal-only, so it is unreachable from the browser.
 */
export const sendInternal = internalAction({
	args: { ...deliverEmailArgs, sentBy: v.string() },
	returns: v.object({ messageId: v.string(), threadId: v.string() }),
	handler: async (
		ctx,
		args
	): Promise<{ messageId: string; threadId: string }> =>
		await deliverEmail(ctx, args),
});
