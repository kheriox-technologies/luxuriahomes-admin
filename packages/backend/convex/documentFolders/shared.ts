import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseDocumentFolderName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Document folder name is required',
		});
	}
	return trimmed;
}

export async function getDocumentFolderOrThrow(
	ctx: MutationCtx,
	documentFolderId: Id<'documentFolders'>
) {
	const folder = await ctx.db.get(documentFolderId);
	if (!folder) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Document folder not found',
		});
	}
	return folder;
}
