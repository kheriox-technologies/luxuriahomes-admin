/**
 * One special inclusion as it travels from the standard list onto a quotation.
 * Deliberately a plain value, not a row id — a quotation snapshots what it was
 * quoted, so a later edit to the standard list must never reach it.
 */
export interface SpecialInclusionEntry {
	amount?: number;
	text: string;
}

/** The amount input accepts free text; anything unparseable reads as no price. */
export function parseAmountInput(value: string): number | undefined {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return undefined;
	}
	const parsed = Number(trimmed);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return undefined;
	}
	return Math.round(parsed * 100) / 100;
}

/** The stored amount as it should appear in an input. */
export function amountToInput(amount: number | undefined): string {
	return amount === undefined ? '' : String(amount);
}
