const dateFormatter = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'short',
});

const currencyFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	maximumFractionDigits: 0,
});

export function formatDate(epochMs: number | undefined): string {
	if (!epochMs) {
		return '—';
	}
	return dateFormatter.format(new Date(epochMs));
}

export function formatShortDate(epochMs: number | undefined): string {
	if (!epochMs) {
		return '—';
	}
	return shortDateFormatter.format(new Date(epochMs));
}

export function formatCurrency(value: number | undefined): string {
	if (value === undefined) {
		return '—';
	}
	return currencyFormatter.format(value);
}

const MINUS_SIGN = '−';

export function formatSignedCurrency(value: number): string {
	if (value === 0) {
		return currencyFormatter.format(0);
	}
	const sign = value > 0 ? '+' : MINUS_SIGN;
	return `${sign}${currencyFormatter.format(Math.abs(value))}`;
}

const whitespace = /\s+/;

export function getInitials(name: string): string {
	const parts = name.trim().split(whitespace);
	const first = parts[0]?.[0] ?? '';
	const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';
	return `${first}${last}`.toUpperCase() || '?';
}
