import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	APPROVAL_VERSION_DESCRIPTION,
	APPROVED_QUOTATION_STATUS,
	getClientQuotationOrThrow,
	REVIEW_QUOTATION_STATUS,
	recordQuotationStatusEvent,
} from './shared';

/**
 * Approves a quotation that is under review.
 *
 * Approval changes nothing about what was quoted, so the version is deliberately
 * left where it is and no new PDF is issued — the history gains a row at the
 * current version recording who approved it and when.
 */
export const approve = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getClientQuotationOrThrow(ctx, args.quotationId);

		if (existing.status !== REVIEW_QUOTATION_STATUS) {
			throw new ConvexError({
				code: 'INVALID_STATUS',
				message: 'Only a quotation under review can be approved',
			});
		}

		const approvedBy = identity.name ?? identity.email ?? 'Unknown';
		const approvedAt = Date.now();

		await ctx.db.patch(args.quotationId, {
			status: APPROVED_QUOTATION_STATUS,
			updatedAt: approvedAt,
			updatedBy: approvedBy,
		});

		const currentVersion = await recordQuotationStatusEvent(ctx, {
			description: APPROVAL_VERSION_DESCRIPTION,
			quotation: existing,
			updatedAt: approvedAt,
			updatedBy: approvedBy,
		});

		return { status: APPROVED_QUOTATION_STATUS, version: currentVersion };
	},
});
