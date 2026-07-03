type BadgeVariant = 'secondary' | 'warning' | 'success' | 'info' | 'purple';

/** Maps a projectTasks/projectStages status to a Badge variant. */
export function getTaskStatusVariant(status: string): BadgeVariant {
	if (status === 'In Progress') {
		return 'warning';
	}
	if (status === 'Complete') {
		return 'success';
	}
	return 'secondary';
}

/** Maps a projectOrders status to a Badge variant. */
export function getOrderStatusVariant(status: string): BadgeVariant {
	switch (status) {
		case 'Delivered':
			return 'success';
		case 'Pending':
			return 'warning';
		case 'In Transit':
			return 'purple';
		default:
			return 'info';
	}
}

/** Formats a unix-ms timestamp as e.g. "5 Jun 2026". */
export function formatScheduleDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}
