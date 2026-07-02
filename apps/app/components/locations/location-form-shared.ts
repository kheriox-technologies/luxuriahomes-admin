import { z } from 'zod';

export const locationFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

export const emptyLocationFormValues: LocationFormValues = {
	name: '',
	description: '',
};

export function locationFormFieldError(
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
