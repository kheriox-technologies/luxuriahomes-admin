import { ConvexError, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	APPROVAL_VERSION_DESCRIPTION,
	APPROVED_QUOTATION_STATUS,
	REVIEW_QUOTATION_STATUS,
	recordQuotationStatusEvent,
} from '../../clientQuotations/shared';
import { clientDisplayName } from '../../lib/clientAccess';
import { createNotification, quotationsLink } from '../../notifications/shared';
import { requireQuotationClient } from './shared';

/**
 * Approves a quotation from the client portal.
 *
 * Same rules as the admin approval — only a quotation under review can be
 * approved, and the approval is recorded against the current version rather than
 * minting a new one — with the client's name on the history row and an admin
 * notification raised.
 */
export const approve = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		const { identity, quotation } = await requireQuotationClient(
			ctx,
			args.quotationId
		);

		if (quotation.status !== REVIEW_QUOTATION_STATUS) {
			throw new ConvexError({
				code: 'INVALID_STATUS',
				message: 'Only a quotation under review can be approved',
			});
		}

		const approvedBy = clientDisplayName(identity);
		const approvedAt = Date.now();

		await ctx.db.patch(args.quotationId, {
			status: APPROVED_QUOTATION_STATUS,
			updatedAt: approvedAt,
			updatedBy: approvedBy,
		});

		const currentVersion = await recordQuotationStatusEvent(ctx, {
			description: APPROVAL_VERSION_DESCRIPTION,
			quotation,
			updatedAt: approvedAt,
			updatedBy: approvedBy,
		});

		await createNotification(ctx, {
			type: 'quotation_approved',
			message: `${quotation.reference} - Quotation for ${quotation.projectName} approved by the client`,
			fromName: approvedBy,
			fromEmail: identity.email,
			link: quotationsLink(),
		});

		return { status: APPROVED_QUOTATION_STATUS, version: currentVersion };
	},
});
