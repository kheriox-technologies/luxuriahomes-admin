import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseLocationName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Location name is required',
		});
	}
	return trimmed;
}

export async function getLocationOrThrow(
	ctx: MutationCtx,
	locationId: Id<'locations'>
) {
	const location = await ctx.db.get(locationId);
	if (!location) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Location not found',
		});
	}
	return location;
}
