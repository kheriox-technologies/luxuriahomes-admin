import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
	type EmailSignatureFields,
	renderSignatureHtml,
	SIGNATURE_COMPANY,
	SIGNATURE_QBCC_LICENCE,
	SIGNATURE_WEBSITE,
} from '../lib/signatureHtml';

/** Argument validator shared by the add and update mutations. */
export const signatureFieldsValidator = v.object({
	fullName: v.string(),
	designation: v.optional(v.string()),
	company: v.optional(v.string()),
	mobile: v.optional(v.string()),
	phone: v.optional(v.string()),
	email: v.optional(v.string()),
	address: v.optional(v.string()),
	tagline: v.optional(v.string()),
	disclaimer: v.optional(v.string()),
	qbccLicence: v.optional(v.string()),
	website: v.string(),
});

function trimOptional(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

/**
 * Trims every field, applies the company/website defaults and guarantees a
 * full name is present.
 */
export function parseSignatureFields(
	fields: EmailSignatureFields
): EmailSignatureFields {
	const fullName = fields.fullName.trim();
	if (fullName.length === 0) {
		throw new ConvexError({
			code: 'INVALID_FULL_NAME',
			message: 'Full name is required',
		});
	}
	return {
		fullName,
		designation: trimOptional(fields.designation),
		company: trimOptional(fields.company) ?? SIGNATURE_COMPANY,
		mobile: trimOptional(fields.mobile),
		phone: trimOptional(fields.phone),
		email: trimOptional(fields.email),
		address: trimOptional(fields.address),
		tagline: trimOptional(fields.tagline),
		disclaimer: trimOptional(fields.disclaimer),
		qbccLicence: trimOptional(fields.qbccLicence) ?? SIGNATURE_QBCC_LICENCE,
		website: fields.website.trim() || SIGNATURE_WEBSITE,
	};
}

/** Renders the HTML stored on the signature and shipped in emails. */
export function renderSignatureContent(fields: EmailSignatureFields): string {
	return renderSignatureHtml(fields);
}

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
