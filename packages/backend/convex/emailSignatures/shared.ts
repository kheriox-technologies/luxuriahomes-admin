import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseSignatureName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Signature name is required',
		});
	}
	return trimmed;
}

export async function getSignatureOrThrow(
	ctx: MutationCtx,
	signatureId: Id<'emailSignatures'>
) {
	const signature = await ctx.db.get(signatureId);
	if (!signature) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Signature not found',
		});
	}
	return signature;
}

/**
 * Clears the `isDefault` flag on every signature except the one being kept,
 * guaranteeing at most one default signature at a time.
 */
export async function clearOtherDefaultSignatures(
	ctx: MutationCtx,
	keepId?: Id<'emailSignatures'>
): Promise<void> {
	const signatures = await ctx.db.query('emailSignatures').collect();
	for (const signature of signatures) {
		if (signature._id !== keepId && signature.isDefault) {
			await ctx.db.patch(signature._id, { isDefault: false });
		}
	}
}
