import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseMaterialColorName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Material color name is required',
		});
	}
	return trimmed;
}

export async function getMaterialColorOrThrow(
	ctx: MutationCtx,
	materialColorId: Id<'materialColors'>
) {
	const materialColor = await ctx.db.get(materialColorId);
	if (!materialColor) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Material color not found',
		});
	}
	return materialColor;
}
