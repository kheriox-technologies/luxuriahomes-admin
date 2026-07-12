'use node';

import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Admin-triggered, on-demand version of the nightly Xero spend sync. Runs the
 * exact same logic as the cron and returns the `{ updated, skipped }` summary.
 * Invoked from the portal projects table via `useAction`.
 */
export const syncProjectSpendNow = action({
	args: {},
	handler: async (ctx): Promise<{ updated: number; skipped: number }> => {
		await requireAdmin(ctx);
		return await ctx.runAction(
			internal.xero.syncProjectSpend.syncProjectSpend,
			{}
		);
	},
});
