import { z } from 'zod';

export const inclusionCategoryNameSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export const emptyInclusionCategoryFormValues: z.input<
	typeof inclusionCategoryNameSchema
> = {
	name: '',
};

export function inclusionCategoryFieldError(
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
