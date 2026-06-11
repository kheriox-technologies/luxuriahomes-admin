import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseMaterialItemName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Item name is required',
		});
	}
	return trimmed;
}

export async function getMaterialItemOrThrow(
	ctx: MutationCtx,
	itemId: Id<'materialItems'>
) {
	const item = await ctx.db.get(itemId);
	if (!item) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Material item not found',
		});
	}
	return item;
}
