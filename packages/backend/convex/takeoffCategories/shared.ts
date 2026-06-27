import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseTakeoffCategoryName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Take offs category name is required',
		});
	}
	return trimmed;
}

export async function getTakeoffCategoryOrThrow(
	ctx: MutationCtx,
	takeoffCategoryId: Id<'takeoffCategories'>
) {
	const takeoffCategory = await ctx.db.get(takeoffCategoryId);
	if (!takeoffCategory) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Take offs category not found',
		});
	}
	return takeoffCategory;
}
