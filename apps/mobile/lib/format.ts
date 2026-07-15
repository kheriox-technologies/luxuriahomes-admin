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

// Manual compact currency formatter for summary tiles, e.g. `$18.4M`, `$980K`,
// `-$1,234`. Built by hand rather than using Intl `notation: 'compact'`, which
// Hermes does not reliably support (see formatRelativeTime note below).
const THOUSAND = 1000;
const MILLION = 1_000_000;

export function formatCurrencyCompact(value: number | undefined): string {
	if (value === undefined) {
		return '—';
	}
	const sign = value < 0 ? '-' : '';
	const abs = Math.abs(value);
	if (abs >= MILLION) {
		return `${sign}$${(abs / MILLION).toFixed(1)}M`;
	}
	if (abs >= THOUSAND) {
		return `${sign}$${Math.round(abs / THOUSAND)}K`;
	}
	return `${sign}${currencyFormatter.format(abs)}`;
}

const MINUS_SIGN = '−';

export function formatSignedCurrency(value: number): string {
	if (value === 0) {
		return currencyFormatter.format(0);
	}
	const sign = value > 0 ? '+' : MINUS_SIGN;
	return `${sign}${currencyFormatter.format(Math.abs(value))}`;
}

const MS_PER_SECOND = 1000;

// Hermes (React Native) does not ship Intl.RelativeTimeFormat, so build the
// relative string manually. Amount is the number of the smaller unit in one of
// the given unit; label is used for the output string.
const RELATIVE_DIVISIONS: { amount: number; label: string }[] = [
	{ amount: 60, label: 'second' },
	{ amount: 60, label: 'minute' },
	{ amount: 24, label: 'hour' },
	{ amount: 7, label: 'day' },
	{ amount: 4.345_24, label: 'week' },
	{ amount: 12, label: 'month' },
	{ amount: Number.POSITIVE_INFINITY, label: 'year' },
];

// Formats a timestamp (ms) as a relative time string, e.g. "2 days ago" or
// "in 3 hours". Returns "Never" for null/0 timestamps.
export function formatRelativeTime(timestamp: number | null): string {
	if (!timestamp) {
		return 'Never';
	}

	let duration = (timestamp - Date.now()) / MS_PER_SECOND;
	for (const division of RELATIVE_DIVISIONS) {
		if (Math.abs(duration) < division.amount) {
			const rounded = Math.round(duration);
			if (rounded === 0) {
				return 'just now';
			}
			const count = Math.abs(rounded);
			const unit = count === 1 ? division.label : `${division.label}s`;
			return rounded < 0 ? `${count} ${unit} ago` : `in ${count} ${unit}`;
		}
		duration /= division.amount;
	}
	return 'Never';
}

const whitespace = /\s+/;

export function getInitials(name: string): string {
	const parts = name.trim().split(whitespace);
	const first = parts[0]?.[0] ?? '';
	const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';
	return `${first}${last}`.toUpperCase() || '?';
}
