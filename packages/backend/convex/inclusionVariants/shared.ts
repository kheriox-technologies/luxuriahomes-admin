import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SUFFIX_LEN = 4;
const MAX_CODE_ATTEMPTS = 24;

export type InclusionVariantClass = 'Standard' | 'Gold' | 'Platinum';

function randomAlphanumericSuffix(length: number): string {
	const buf = new Uint8Array(length);
	crypto.getRandomValues(buf);
	let out = '';
	const radix = CODE_CHARS.length;
	for (let i = 0; i < length; i++) {
		const byte = buf[i];
		if (byte === undefined) {
			break;
		}
		const ch = CODE_CHARS[byte % radix];
		if (ch !== undefined) {
			out += ch;
		}
	}
	return out;
}

export async function allocateUniqueVariantCode(
	ctx: MutationCtx,
	categoryCode: string
): Promise<string> {
	const prefix = categoryCode.trim().toUpperCase();
	for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
		const suffix = randomAlphanumericSuffix(SUFFIX_LEN);
		const code = `${prefix}-${suffix}`;
		const clash = await ctx.db
			.query('inclusionVariants')
			.withIndex('by_code', (q) => q.eq('code', code))
			.first();
		if (!clash) {
			return code;
		}
	}
	throw new ConvexError({
		code: 'CODE_GENERATION_FAILED',
		message: 'Could not generate a unique variant code',
	});
}

export function parseVendor(vendor: string): string {
	const trimmed = vendor.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_VENDOR',
			message: 'Vendor is required',
		});
	}
	return trimmed;
}

export function parseModels(models: string[]): string[] {
	const out: string[] = [];
	for (const m of models) {
		const t = m.trim();
		if (t.length > 0) {
			out.push(t);
		}
	}
	return out;
}

export function parseOptionalDetail(
	value: string | undefined
): string | undefined {
	if (value === undefined) {
		return undefined;
	}
	const t = value.trim();
	return t.length > 0 ? t : undefined;
}

export function parseMoney2(value: number, label: string): number {
	if (!Number.isFinite(value)) {
		throw new ConvexError({
			code: 'INVALID_PRICE',
			message: `${label} must be a finite number`,
		});
	}
	return Math.round(value * 100) / 100;
}

export async function deleteVariantStorageIfPresent(
	ctx: MutationCtx,
	storageId: Id<'_storage'> | undefined
) {
	if (storageId) {
		await ctx.storage.delete(storageId);
	}
}
