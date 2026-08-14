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

const PERCENT_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;
const MAX_PERCENT = 100;
const CENTS = 100;

export function isValidPercentString(value: string): boolean {
	const trimmed = value.trim();
	return PERCENT_PATTERN.test(trimmed) && Number(trimmed) <= MAX_PERCENT;
}

export function parsePercentString(value: string): number {
	if (!isValidPercentString(value)) {
		throw new Error('Invalid percent value');
	}
	return Number(value.trim());
}

/** Dollar contingency for a line — mirrors the server's rounding. */
export function contingencyAmount(
	price: number | null | undefined,
	percent: number | null | undefined
): number {
	if (!(price && percent)) {
		return 0;
	}
	return Math.round(price * (percent / MAX_PERCENT) * CENTS) / CENTS;
}

/** `10% ($2,300.00)`, or just `0%` when there is nothing to add. */
export function formatContingency(
	price: number | null | undefined,
	percent: number | null | undefined
): string {
	const pct = percent ?? 0;
	const amount = contingencyAmount(price, pct);
	if (amount === 0) {
		return `${pct}%`;
	}
	return `${pct}% (${formatBudgetPrice(amount)})`;
}
