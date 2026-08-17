import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	APPROVAL_VERSION_DESCRIPTION,
	APPROVED_QUOTATION_STATUS,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	initialVersionFrom,
	insertQuotationVersion,
	REVIEW_QUOTATION_STATUS,
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

		// Quotations issued before versioning existed have no history rows, so the
		// approval would otherwise be the only entry in the trail — the revision it
		// approved has to be there first.
		const history = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();
		if (history.length === 0) {
			await insertQuotationVersion(ctx, {
				quotationId: args.quotationId,
				...initialVersionFrom(existing),
			});
		}

		const currentVersion = existing.version ?? FIRST_VERSION;

		await ctx.db.patch(args.quotationId, {
			status: APPROVED_QUOTATION_STATUS,
			updatedAt: approvedAt,
			updatedBy: approvedBy,
		});

		// No document fields: approving issues no new PDF, so the row points at
		// nothing to open.
		await insertQuotationVersion(ctx, {
			quotationId: args.quotationId,
			version: currentVersion,
			changeType: 'Status',
			description: APPROVAL_VERSION_DESCRIPTION,
			updatedBy: approvedBy,
			updatedAt: approvedAt,
			totalInclGst: existing.totalInclGst,
		});

		return { status: APPROVED_QUOTATION_STATUS, version: currentVersion };
	},
});
