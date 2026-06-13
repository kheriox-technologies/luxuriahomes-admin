import { z } from 'zod';

export const scheduleTaskFormSchema = z.object({
	name: z.string().trim().min(1, 'Task name is required'),
	durationDays: z
		.number()
		.int('Duration must be a whole number')
		.min(1, 'Duration must be at least 1 day'),
	dependencyTaskId: z.string().optional(),
	dependencyType: z.enum(['startAfter', 'startWith']).optional(),
});

export type ScheduleTaskFormValues = z.infer<typeof scheduleTaskFormSchema>;

export const emptyScheduleTaskFormValues: ScheduleTaskFormValues = {
	name: '',
	durationDays: 1,
	dependencyTaskId: undefined,
	dependencyType: 'startAfter',
};

export function taskFormFieldError(
	errors: readonly unknown[] | undefined
): string {
	if (!errors || errors.length === 0) {
		return '';
	}
	return errors
		.map((e) => (e instanceof Error ? e.message : String(e ?? '')))
		.filter(Boolean)
		.join(' ');
}
