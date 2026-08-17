import { z } from 'zod';

export const quoteTermSectionFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type QuoteTermSectionFormValues = z.infer<
	typeof quoteTermSectionFormSchema
>;

export const emptyQuoteTermSectionFormValues: QuoteTermSectionFormValues = {
	name: '',
};

export const quoteTermItemFormSchema = z.object({
	text: z.string().trim().min(1, 'Clause text is required'),
});

export type QuoteTermItemFormValues = z.infer<typeof quoteTermItemFormSchema>;

export const emptyQuoteTermItemFormValues: QuoteTermItemFormValues = {
	text: '',
};

export function quoteTermFormFieldError(
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
