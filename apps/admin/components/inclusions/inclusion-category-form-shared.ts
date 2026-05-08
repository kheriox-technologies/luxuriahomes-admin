import { z } from 'zod';

/** First up to three letters from the name (A–Z only), uppercased. */
export function defaultInclusionCategoryCodeFromName(name: string): string {
	const letters = name.match(/[A-Za-z]/g);
	if (!letters || letters.length === 0) {
		return '';
	}
	return letters.slice(0, 3).join('').toUpperCase();
}

export const inclusionCategoryFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	code: z
		.string()
		.trim()
		.min(1, 'Code is required')
		.max(32, 'Code must be at most 32 characters')
		.regex(/^[A-Za-z0-9]+$/, 'Code can only contain letters and numbers'),
});

export const emptyInclusionCategoryFormValues: z.input<
	typeof inclusionCategoryFormSchema
> = {
	name: '',
	code: '',
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
