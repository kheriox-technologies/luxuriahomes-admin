const MS_PER_SECOND = 1000;

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
	{ amount: 60, unit: 'second' },
	{ amount: 60, unit: 'minute' },
	{ amount: 24, unit: 'hour' },
	{ amount: 7, unit: 'day' },
	{ amount: 4.345_24, unit: 'week' },
	{ amount: 12, unit: 'month' },
	{ amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

const relativeFormatter = new Intl.RelativeTimeFormat('en', {
	numeric: 'auto',
	style: 'long',
});

/**
 * Formats a timestamp (ms) as a relative time string, e.g. "2 days ago" or
 * "3 months ago". Returns an em dash for null/0 timestamps.
 */
export function formatRelativeTime(timestamp: number | null): string {
	if (!timestamp) {
		return '—';
	}

	let duration = (timestamp - Date.now()) / MS_PER_SECOND;
	for (const division of DIVISIONS) {
		if (Math.abs(duration) < division.amount) {
			return relativeFormatter.format(Math.round(duration), division.unit);
		}
		duration /= division.amount;
	}
	return '—';
}
