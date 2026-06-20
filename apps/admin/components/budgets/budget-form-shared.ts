import { z } from 'zod';

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export const budgetDraftSchema = z
	.object({
		title: z.string().trim().min(1, 'Title is required'),
		description: z.string().optional(),
		price: z
			.string()
			.trim()
			.min(1, 'Price is required')
			.regex(MONEY_PATTERN, 'Enter a valid amount (up to 2 decimals)'),
		tradeId: z.string(),
		newTradeName: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (!(data.tradeId.trim() || data.newTradeName?.trim())) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Trade is required',
				path: ['tradeId'],
			});
		}
	});

export type BudgetDraftValues = z.infer<typeof budgetDraftSchema>;

export const emptyBudgetDraft: BudgetDraftValues = {
	title: '',
	description: '',
	price: '',
	tradeId: '',
	newTradeName: '',
};

export function parseMoneyString(value: string): number {
	const normalized = value.trim();
	if (!MONEY_PATTERN.test(normalized)) {
		throw new Error('Invalid money value');
	}
	return Number(normalized);
}

export function budgetDraftErrorMessage(
	error: z.ZodError<BudgetDraftValues>
): string {
	return error.issues.map((i) => i.message).join(' ');
}

const budgetPriceFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

export function formatBudgetPrice(price: number): string {
	return budgetPriceFormatter.format(price);
}
