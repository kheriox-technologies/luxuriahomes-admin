import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseQuoteNoteText(text: string): string {
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Note text is required',
		});
	}
	return trimmed;
}

export async function getQuoteNoteOrThrow(
	ctx: QueryCtx,
	noteId: Id<'quoteNotes'>
) {
	const note = await ctx.db.get(noteId);
	if (!note) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Note not found',
		});
	}
	return note;
}

/** Next sort position for a new note, appended after the existing ones. */
export async function nextQuoteNoteOrder(ctx: MutationCtx): Promise<number> {
	const notes = await ctx.db.query('quoteNotes').collect();
	return notes.length;
}
