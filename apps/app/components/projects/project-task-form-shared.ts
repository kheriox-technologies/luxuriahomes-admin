import { z } from 'zod';

export const projectTaskFormSchema = z.object({
	name: z.string().trim().min(1, 'Task name is required'),
	durationDays: z
		.number()
		.int('Duration must be a whole number')
		.min(1, 'Duration must be at least 1 day'),
	offsetDays: z
		.number()
		.int('Must be a whole number')
		.min(0, 'Cannot be negative'),
	dependencyTaskId: z.string().optional(),
	dependencyType: z.enum(['startAfter', 'startWith']).optional(),
	status: z.enum(['Pending', 'In Progress', 'Complete']).optional(),
});

export type ProjectTaskFormValues = z.infer<typeof projectTaskFormSchema>;

export const emptyProjectTaskFormValues: ProjectTaskFormValues = {
	name: '',
	durationDays: 1,
	offsetDays: 0,
	dependencyTaskId: undefined,
	dependencyType: 'startAfter',
	status: undefined,
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
