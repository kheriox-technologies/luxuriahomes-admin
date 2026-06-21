import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	getTemplateOrThrow,
	seedMissingTradeItems,
} from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Adds a $0 item for any trade not yet present in the template. Called when the
 * template detail view opens so templates created before a trade existed still
 * show every trade. Returns the number of items added.
 */
export const ensureAllTrades = mutation({
	args: { budgetTemplateId: v.id('budgetTemplates') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);
		return await seedMissingTradeItems(ctx, args.budgetTemplateId);
	},
});
