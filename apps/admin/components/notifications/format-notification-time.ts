const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit',
});

/**
 * Compact relative time for recent notifications, falling back to an absolute
 * date/time for anything older than a day.
 */
export function formatNotificationTime(timestamp: number): string {
	const diff = Date.now() - timestamp;
	if (diff < MS_PER_MINUTE) {
		return 'Just now';
	}
	if (diff < MS_PER_HOUR) {
		const minutes = Math.floor(diff / MS_PER_MINUTE);
		return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
	}
	if (diff < MS_PER_DAY) {
		const hours = Math.floor(diff / MS_PER_HOUR);
		return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	}
	return dateTimeFormatter.format(new Date(timestamp));
}
