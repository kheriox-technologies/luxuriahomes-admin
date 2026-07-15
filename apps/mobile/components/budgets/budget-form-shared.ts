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
