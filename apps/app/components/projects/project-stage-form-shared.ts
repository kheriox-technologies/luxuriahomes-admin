import { z } from 'zod';

export const projectStageFormSchema = z.object({
	name: z.string().trim().min(1, 'Stage name is required'),
	offsetDays: z
		.number()
		.int('Must be a whole number')
		.min(0, 'Cannot be negative'),
	dependencyStageId: z.string().optional(),
	dependencyType: z.enum(['startAfter', 'startWith']).optional(),
	status: z.enum(['Pending', 'In Progress', 'Complete']).optional(),
});

export type ProjectStageFormValues = z.infer<typeof projectStageFormSchema>;

export const emptyProjectStageFormValues: ProjectStageFormValues = {
	name: '',
	offsetDays: 0,
	dependencyStageId: undefined,
	dependencyType: 'startAfter',
	status: undefined,
};

export function stageFormFieldError(
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
