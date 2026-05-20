import { z } from 'zod';

export const taskDependencySchema = z.object({
	taskId: z.string().min(1),
	type: z.enum(['after', 'alongWith']),
});

export const taskFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	duration: z.number().min(0, 'Duration must be 0 or greater'),
	dependsOn: z.array(taskDependencySchema).default([]),
	linkedOrderIds: z.array(z.string()).default([]),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskDependency = z.infer<typeof taskDependencySchema>;

export const emptyTaskFormValues: TaskFormValues = {
	name: '',
	description: '',
	duration: 0,
	dependsOn: [],
	linkedOrderIds: [],
};

export function taskFormFieldError(
	errors: readonly unknown[] | undefined
): string {
	if (!errors || errors.length === 0) {
		return '';
	}
	return errors
		.map((error) =>
			error instanceof Error ? error.message : String(error ?? '')
		)
		.filter(Boolean)
		.join(' ');
}
