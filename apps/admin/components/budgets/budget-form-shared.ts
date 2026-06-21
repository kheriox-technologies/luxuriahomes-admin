import { z } from 'zod';

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export const budgetTemplateDraftSchema = z.object({
	title: z.string().trim().min(1, 'Title is required'),
	description: z.string().optional(),
});

export type BudgetTemplateDraftValues = z.infer<
	typeof budgetTemplateDraftSchema
>;

export const emptyBudgetTemplateDraft: BudgetTemplateDraftValues = {
	title: '',
	description: '',
};

export function budgetTemplateDraftErrorMessage(
	error: z.ZodError<BudgetTemplateDraftValues>
): string {
	return error.issues.map((i) => i.message).join(' ');
}

export function isValidMoneyString(value: string): boolean {
	return MONEY_PATTERN.test(value.trim());
}

export function parseMoneyString(value: string): number {
	const normalized = value.trim();
	if (!MONEY_PATTERN.test(normalized)) {
		throw new Error('Invalid money value');
	}
	return Number(normalized);
}

const budgetPriceFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

export function formatBudgetPrice(price: number): string {
	return budgetPriceFormatter.format(price);
}
