import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseBudgetTitle(title: string): string {
	const trimmed = title.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_TITLE',
			message: 'Budget title is required',
		});
	}
	return trimmed;
}

export function parseBudgetPrice(price: number): number {
	if (!Number.isFinite(price) || price < 0) {
		throw new ConvexError({
			code: 'INVALID_PRICE',
			message: 'Budget price must be a positive number',
		});
	}
	return price;
}

export async function getBudgetOrThrow(
	ctx: MutationCtx,
	budgetId: Id<'budgets'>
) {
	const budget = await ctx.db.get(budgetId);
	if (!budget) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Budget not found',
		});
	}
	return budget;
}
