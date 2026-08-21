/**
 * Display formatting for quotation figures and dates.
 *
 * Pure and locale-owning: the PDF builder never touches `Intl` itself, so a
 * quotation rendered from the portal, from mobile, or from a signature rebuild
 * prints identical strings. Mirrors `apps/portal/lib/currency.ts` and
 * `formatIssueDate` in the portal's `client-quotation-form-shared.ts`.
 */

const audWhole = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	maximumFractionDigits: 0,
});

const aud = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

/** A whole-dollar AUD amount, e.g. `$20,000`. */
export function formatAudWhole(amount: number): string {
	return audWhole.format(amount);
}

/** An AUD amount with cents, e.g. `$1,234.50`. */
export function formatAud(amount: number): string {
	return aud.format(amount);
}

const issueDate = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
});

/** The issue date as it prints on the cover, e.g. `17 August 2026`. */
export function formatIssueDate(date: Date): string {
	return issueDate.format(date);
}
