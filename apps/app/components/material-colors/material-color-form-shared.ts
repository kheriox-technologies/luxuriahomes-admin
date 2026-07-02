import { z } from 'zod';

export const materialColorFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
});

export type MaterialColorFormValues = z.infer<typeof materialColorFormSchema>;

export const emptyMaterialColorFormValues: MaterialColorFormValues = {
	name: '',
	description: '',
};

export function materialColorFormFieldError(
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
