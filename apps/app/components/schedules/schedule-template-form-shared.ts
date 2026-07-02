import { z } from 'zod';

export const scheduleTemplateFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
});

export type ScheduleTemplateFormValues = z.infer<
	typeof scheduleTemplateFormSchema
>;

export const emptyScheduleTemplateFormValues: ScheduleTemplateFormValues = {
	name: '',
	description: '',
};

export function scheduleTemplateFormFieldError(
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
