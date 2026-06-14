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
