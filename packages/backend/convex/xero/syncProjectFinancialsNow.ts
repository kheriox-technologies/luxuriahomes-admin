'use node';

import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Admin-triggered, on-demand version of the nightly Xero financials sync. Runs
 * the exact same logic as the cron (Spent + Received) and returns the
 * `{ updated, skipped }` summary. Invoked from the portal projects table via
 * `useAction`.
 */
export const syncProjectFinancialsNow = action({
	args: {},
	handler: async (ctx): Promise<{ updated: number; skipped: number }> => {
		await requireAdmin(ctx);
		return await ctx.runAction(
			internal.xero.syncProjectFinancials.syncProjectFinancials,
			{}
		);
	},
});
