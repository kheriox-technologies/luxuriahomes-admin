// Window helpers mirrored from apps/portal/components/dashboard/dashboard-content.tsx

export type WindowKey = '1week' | '2weeks' | '3weeks' | '1month' | '2months';

export const WINDOW_OPTIONS: { value: WindowKey; label: string }[] = [
	{ value: '1week', label: '1 Week' },
	{ value: '2weeks', label: '2 Weeks' },
	{ value: '3weeks', label: '3 Weeks' },
	{ value: '1month', label: '1 Month' },
	{ value: '2months', label: '2 Months' },
];

export const MAX_PROJECTS = 5;

export function getWindowRange(windowKey: WindowKey) {
	const now = new Date();
	const start = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	).getTime();
	const end = new Date(start);
	switch (windowKey) {
		case '1week':
			end.setDate(end.getDate() + 7);
			break;
		case '2weeks':
			end.setDate(end.getDate() + 14);
			break;
		case '3weeks':
			end.setDate(end.getDate() + 21);
			break;
		case '1month':
			end.setMonth(end.getMonth() + 1);
			break;
		case '2months':
			end.setMonth(end.getMonth() + 2);
			break;
		default:
			break;
	}
	return { rangeStart: start, rangeEnd: end.getTime() };
}
