import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseTemplateTitle(title: string): string {
	const trimmed = title.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_TITLE',
			message: 'Budget template title is required',
		});
	}
	return trimmed;
}

export function parseItemPrice(price: number): number {
	if (!Number.isFinite(price) || price < 0) {
		throw new ConvexError({
			code: 'INVALID_PRICE',
			message: 'Price must be a positive number',
		});
	}
	return price;
}

export async function getTemplateOrThrow(
	ctx: MutationCtx,
	budgetTemplateId: Id<'budgetTemplates'>
) {
	const template = await ctx.db.get(budgetTemplateId);
	if (!template) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Budget template not found',
		});
	}
	return template;
}

/**
 * Ensures the template has a budgetTemplateItem for every trade, inserting a
 * $0 item for any trade not yet present. Newly inserted items are $0 so the
 * template total is unaffected. Returns the number of items added.
 */
export async function seedMissingTradeItems(
	ctx: MutationCtx,
	budgetTemplateId: Id<'budgetTemplates'>
): Promise<number> {
	const [trades, items] = await Promise.all([
		ctx.db.query('trades').collect(),
		ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template', (q) =>
				q.eq('budgetTemplateId', budgetTemplateId)
			)
			.collect(),
	]);
	const existing = new Set(items.map((item) => item.tradeId));
	let added = 0;
	for (const trade of trades) {
		if (!existing.has(trade._id)) {
			await ctx.db.insert('budgetTemplateItems', {
				budgetTemplateId,
				tradeId: trade._id,
				price: 0,
			});
			added += 1;
		}
	}
	return added;
}

/**
 * Recomputes a budget template's totalPrice from its items and patches the row.
 * Call after any add/update/remove of a budgetTemplateItem.
 */
export async function recomputeTemplateTotal(
	ctx: MutationCtx,
	budgetTemplateId: Id<'budgetTemplates'>
): Promise<number> {
	const items = await ctx.db
		.query('budgetTemplateItems')
		.withIndex('by_template', (q) => q.eq('budgetTemplateId', budgetTemplateId))
		.collect();
	const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
	await ctx.db.patch(budgetTemplateId, { totalPrice });
	return totalPrice;
}
