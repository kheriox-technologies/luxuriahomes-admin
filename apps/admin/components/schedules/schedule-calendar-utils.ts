export function businessDayToCalendarOffset(
	bizDay: number,
	today: Date
): number {
	const d = new Date(today);
	let calOffset = 0;
	while (d.getDay() === 0 || d.getDay() === 6) {
		d.setDate(d.getDate() + 1);
		calOffset++;
	}
	let remaining = bizDay;
	while (remaining > 0) {
		d.setDate(d.getDate() + 1);
		calOffset++;
		if (d.getDay() !== 0 && d.getDay() !== 6) {
			remaining--;
		}
	}
	return calOffset;
}

// Fixed Monday for template duration calculations — not tied to a real-world date.
// 2024-01-01 is a Monday.
export const MONDAY_ANCHOR = new Date(2024, 0, 1);

export function countBusinessDaysInRange(
	calStart: number,
	calEnd: number,
	today: Date
): number {
	if (calEnd < calStart) {
		return 0;
	}
	const d = new Date(today);
	d.setDate(d.getDate() + calStart);
	let count = 0;
	for (let i = calStart; i <= calEnd; i++) {
		const dow = d.getDay();
		if (dow !== 0 && dow !== 6) {
			count++;
		}
		d.setDate(d.getDate() + 1);
	}
	return Math.max(1, count);
}
