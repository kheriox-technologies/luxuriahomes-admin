import { ConvexError, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	clientDisplayName,
	requireProjectClient,
} from '../../lib/clientAccess';
import { getProjectInclusionOrThrow } from '../../projectInclusions/shared';

export const deleteNote = mutation({
	args: {
		noteId: v.id('projectInclusionNotes'),
	},
	handler: async (ctx, args) => {
		const note = await ctx.db.get(args.noteId);
		if (!note) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Note not found',
			});
		}
		const inclusion = await getProjectInclusionOrThrow(
			ctx,
			note.projectInclusionId
		);
		const { identity } = await requireProjectClient(ctx, inclusion.projectId);
		// Clients may only delete notes they authored.
		if (note.addedBy !== clientDisplayName(identity)) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You can only delete your own notes',
			});
		}
		await ctx.db.delete(args.noteId);
	},
});
