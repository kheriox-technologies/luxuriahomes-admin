// Shared money-string helpers for the mobile budget edit inputs. Mirrors the
// portal's budget-form-shared.ts so validation behaves identically: a raw
// decimal string (no currency symbols) with up to two fraction digits.
const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export function isValidMoneyString(value: string): boolean {
	return MONEY_PATTERN.test(value.trim());
}

export function parseMoneyString(value: string): number {
	return Number.parseFloat(value.trim());
}

// Contingency percentages: 0–100 with up to two fraction digits.
const PERCENT_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;
const MAX_PERCENT = 100;
const CENTS = 100;

export function isValidPercentString(value: string): boolean {
	const trimmed = value.trim();
	return PERCENT_PATTERN.test(trimmed) && Number(trimmed) <= MAX_PERCENT;
}

export function parsePercentString(value: string): number {
	return Number.parseFloat(value.trim());
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
