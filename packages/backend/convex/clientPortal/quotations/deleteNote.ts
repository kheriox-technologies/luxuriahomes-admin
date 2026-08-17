import { ConvexError, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { checkIdentity } from '../../lib/checkIdentity';
import { requireQuotationClient } from './shared';

/**
 * Deletes one of the caller's own notes. Notes written by an admin — or by
 * anyone before note authorship was recorded — are not deletable here; only the
 * admin `clientQuotations.deleteNote` can remove those.
 */
export const deleteNote = mutation({
	args: {
		noteId: v.id('clientQuotationNotes'),
	},
	handler: async (ctx, args) => {
		const identity = await checkIdentity(ctx);
		const note = await ctx.db.get(args.noteId);
		if (!note) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Note not found',
			});
		}
		await requireQuotationClient(ctx, note.quotationId);

		if (note.addedByUserId !== identity.subject) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You can only delete your own notes',
			});
		}

		await ctx.db.delete(args.noteId);
	},
});
