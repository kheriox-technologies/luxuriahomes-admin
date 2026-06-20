const audWhole = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	maximumFractionDigits: 0,
});

/** Format a whole-dollar AUD amount, e.g. `$20,000`. */
export function formatAudWhole(amount: number): string {
	return audWhole.format(amount);
}
