import { z } from 'zod';

export const inclusionFormSchema = z.object({
	title: z.string().trim().min(1, 'Title is required'),
	categoryId: z.string().min(1, 'Category is required'),
});

export type InclusionFormValues = z.infer<typeof inclusionFormSchema>;

export const emptyInclusionFormValues: {
	title: string;
	categoryId: string;
} = {
	title: '',
	categoryId: '',
};

export function inclusionFormFieldError(
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

export function formatVariantBadgeLabel(count: number): string {
	if (count === 1) {
		return '1 Variant';
	}
	return `${count} Variants`;
}
