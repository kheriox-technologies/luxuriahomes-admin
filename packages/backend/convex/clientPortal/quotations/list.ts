import { query } from '../../_generated/server';
import { withNoteCounts } from '../../clientQuotations/shared';
import { checkIdentity } from '../../lib/checkIdentity';
import { isQuotationClient, isVisibleToClients } from './shared';

/**
 * Every issued quotation addressed to the signed-in client, newest first.
 *
 * There is no index on client email — a quotation's clients are an embedded
 * array — so this collects and filters in memory, the same shape
 * `clientPortal/projects/list` uses. Volume is a few dozen quotations a year.
 */
export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await checkIdentity(ctx);
		const rows = await ctx.db
			.query('clientQuotations')
			.withIndex('by_created')
			.order('desc')
			.collect();
		const mine = rows.filter(
			(row) => isQuotationClient(row, identity.email) && isVisibleToClients(row)
		);
		return await withNoteCounts(ctx, mine);
	},
});
