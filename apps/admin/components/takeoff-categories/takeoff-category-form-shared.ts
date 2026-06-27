import { z } from 'zod';

export const takeoffCategoryFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type TakeoffCategoryFormValues = z.infer<
	typeof takeoffCategoryFormSchema
>;

export const emptyTakeoffCategoryFormValues: TakeoffCategoryFormValues = {
	name: '',
};

export function takeoffCategoryFormFieldError(
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
