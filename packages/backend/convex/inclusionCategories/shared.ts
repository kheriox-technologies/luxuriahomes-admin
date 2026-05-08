import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

const CATEGORY_CODE_ALNUM_PATTERN = /^[A-Z0-9]+$/;

function normalizeCategoryName(name: string): string {
	return name.trim().toLocaleLowerCase();
}

function normalizeCategoryCode(code: string): string {
	return code.trim().toUpperCase();
}

export function parseCategoryName(name: string): string {
	const trimmedName = name.trim();
	if (trimmedName.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Category name is required',
		});
	}
	return trimmedName;
}

export async function ensureCategoryNameUnique(
	ctx: MutationCtx,
	name: string,
	excludeId?: Id<'inclusionCategories'>
) {
	const normalizedName = normalizeCategoryName(name);
	const categories = await ctx.db.query('inclusionCategories').collect();
	const duplicate = categories.find((category) => {
		if (excludeId && category._id === excludeId) {
			return false;
		}
		return normalizeCategoryName(category.name) === normalizedName;
	});

	if (duplicate) {
		throw new ConvexError({
			code: 'CATEGORY_NAME_EXISTS',
			message: 'A category with this name already exists',
		});
	}
}

export function parseCategoryCode(code: string): string {
	const normalized = normalizeCategoryCode(code);
	if (normalized.length === 0) {
		throw new ConvexError({
			code: 'INVALID_CODE',
			message: 'Category code is required',
		});
	}
	if (!CATEGORY_CODE_ALNUM_PATTERN.test(normalized)) {
		throw new ConvexError({
			code: 'INVALID_CODE',
			message: 'Code can only contain letters and numbers',
		});
	}
	return normalized;
}

export async function ensureCategoryCodeUnique(
	ctx: MutationCtx,
	code: string,
	excludeId?: Id<'inclusionCategories'>
) {
	const normalizedCode = normalizeCategoryCode(code);
	const existing = await ctx.db
		.query('inclusionCategories')
		.withIndex('by_code', (q) => q.eq('code', normalizedCode))
		.first();

	if (existing && (!excludeId || existing._id !== excludeId)) {
		throw new ConvexError({
			code: 'CATEGORY_CODE_EXISTS',
			message: 'A category with this code already exists',
		});
	}
}
