import { ConvexError, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { clientDisplayName } from '../../lib/clientAccess';
import { createNotification, quotationsLink } from '../../notifications/shared';
import { requireQuotationClient } from './shared';

/**
 * Adds a client's note to a quotation — the channel for asking for a
 * clarification or a change — and notifies the admins, mirroring the way client
 * notes on project inclusions work.
 */
export const appendNote = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
		note: v.string(),
	},
	handler: async (ctx, args) => {
		const { identity, quotation } = await requireQuotationClient(
			ctx,
			args.quotationId
		);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}

		const name = clientDisplayName(identity);
		await ctx.db.insert('clientQuotationNotes', {
			quotationId: args.quotationId,
			timestamp: Date.now(),
			addedBy: name,
			addedByUserId: identity.subject,
			note: trimmed,
		});

		await createNotification(ctx, {
			type: 'quotation_note',
			message: `${quotation.reference} - Note added on quotation for ${quotation.projectName}`,
			fromName: name,
			fromEmail: identity.email,
			link: quotationsLink(),
		});

		return args.quotationId;
	},
});
