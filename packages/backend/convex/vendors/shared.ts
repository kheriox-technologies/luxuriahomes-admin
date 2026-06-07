import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseVendorName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Vendor name is required',
		});
	}
	return trimmed;
}

export async function getVendorOrThrow(
	ctx: MutationCtx,
	vendorId: Id<'vendors'>
) {
	const vendor = await ctx.db.get(vendorId);
	if (!vendor) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Vendor not found',
		});
	}
	return vendor;
}
