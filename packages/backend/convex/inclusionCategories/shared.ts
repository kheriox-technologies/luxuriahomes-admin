import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

function normalizeCategoryName(name: string): string {
	return name.trim().toLocaleLowerCase();
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
