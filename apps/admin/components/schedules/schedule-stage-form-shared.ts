import { z } from 'zod';

export const scheduleStageFormSchema = z.object({
	name: z.string().trim().min(1, 'Stage name is required'),
	dependencyStageId: z.string().optional(),
	dependencyType: z.enum(['startAfter', 'startWith']).optional(),
});

export type ScheduleStageFormValues = z.infer<typeof scheduleStageFormSchema>;

export const emptyScheduleStageFormValues: ScheduleStageFormValues = {
	name: '',
	dependencyStageId: undefined,
	dependencyType: 'startAfter',
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
