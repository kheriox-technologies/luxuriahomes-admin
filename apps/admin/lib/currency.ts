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

/** Format a whole-dollar AUD amount, e.g. `$20,000`. */
export function formatAudWhole(amount: number): string {
	return audWhole.format(amount);
}

/** Format an AUD amount with cents, e.g. `$1,234.50`. */
export function formatAud(amount: number): string {
	return aud.format(amount);
}
