import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity, getClientQuotationOrThrow } from './shared';

export const appendNote = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
		note: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		await getClientQuotationOrThrow(ctx, args.quotationId);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		await ctx.db.insert('clientQuotationNotes', {
			quotationId: args.quotationId,
			timestamp: Date.now(),
			addedBy: addedByFromIdentity(identity),
			addedByUserId: identity.subject,
			note: trimmed,
		});
		return args.quotationId;
	},
});
