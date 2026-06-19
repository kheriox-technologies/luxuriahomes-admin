import type { Doc } from '@workspace/backend/dataModel';

type ProjectStatus = Doc<'projects'>['status'];

export interface StatusBadge {
	label: string;
	variant: 'info' | 'warning' | 'success';
}

export function statusBadgeProps(status: ProjectStatus): StatusBadge {
	switch (status) {
		case 'not_started':
			return { label: 'Not started', variant: 'info' };
		case 'in_progress':
			return { label: 'In progress', variant: 'warning' };
		case 'completed':
			return { label: 'Completed', variant: 'success' };
		default: {
			const _exhaustive: never = status;
			return _exhaustive;
		}
	}
}

export function formatAddressLine(address: {
	street: string;
	suburb: string;
	state: string;
	postcode: string;
}): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

export function formatDuration(startDate: number): string {
	const start = new Date(startDate);
	const end = new Date();

	let months =
		(end.getFullYear() - start.getFullYear()) * 12 +
		(end.getMonth() - start.getMonth());
	let days = end.getDate() - start.getDate();

	if (days < 0) {
		months -= 1;
		const daysInPrevMonth = new Date(
			end.getFullYear(),
			end.getMonth(),
			0
		).getDate();
		days += daysInPrevMonth;
	}

	const parts: string[] = [];
	if (months > 0) {
		parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
	}
	if (days > 0) {
		parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
	}
	return parts.length > 0 ? parts.join(' ') : 'Today';
}

function computeStartRelative(
	isFuture: boolean,
	target: Date,
	today: Date
): { months: number; remainingDays: number } {
	const dayMs = 1000 * 60 * 60 * 24;
	if (isFuture) {
		const months =
			(target.getFullYear() - today.getFullYear()) * 12 +
			(target.getMonth() - today.getMonth());
		const afterMonths = new Date(today);
		afterMonths.setMonth(afterMonths.getMonth() + months);
		return {
			months,
			remainingDays: Math.round(
				(target.getTime() - afterMonths.getTime()) / dayMs
			),
		};
	}
	const months =
		(today.getFullYear() - target.getFullYear()) * 12 +
		(today.getMonth() - target.getMonth());
	const afterMonths = new Date(target);
	afterMonths.setMonth(afterMonths.getMonth() + months);
	return {
		months,
		remainingDays: Math.round(
			(today.getTime() - afterMonths.getTime()) / dayMs
		),
	};
}

export function formatStartDateRelative(startDate: number): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const target = new Date(startDate);
	target.setHours(0, 0, 0, 0);

	const diffDays = Math.round(
		(target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
	);

	if (diffDays === 0) {
		return 'Starts today';
	}

	const isFuture = diffDays > 0;
	const absDays = Math.abs(diffDays);
	const { months, remainingDays } = computeStartRelative(
		isFuture,
		target,
		today
	);

	if (months === 0) {
		const label = absDays === 1 ? 'day' : 'days';
		return isFuture
			? `Starts in ${absDays} ${label}`
			: `Started ${absDays} Days ago`;
	}

	const monthLabel = months === 1 ? 'Month' : 'Months';
	const dayPart =
		remainingDays > 0
			? ` ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`
			: '';
	return isFuture
		? `Starts in ${months} ${monthLabel}${dayPart}`
		: `Started ${months} ${monthLabel}${dayPart} ago`;
}

const audFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

export function formatAud(amount: number): string {
	return audFormatter.format(amount);
}

export function formatSignedAud(amount: number): string {
	if (amount === 0) {
		return '$0.00';
	}
	return `${amount > 0 ? '+' : '-'} ${formatAud(Math.abs(amount))}`;
}
