import { z } from 'zod';

export const quoteStageFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type QuoteStageFormValues = z.infer<typeof quoteStageFormSchema>;

export const emptyQuoteStageFormValues: QuoteStageFormValues = {
	name: '',
};

export const quoteSectionFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type QuoteSectionFormValues = z.infer<typeof quoteSectionFormSchema>;

export const emptyQuoteSectionFormValues: QuoteSectionFormValues = {
	name: '',
};

export const quoteItemFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
});

export type QuoteItemFormValues = z.infer<typeof quoteItemFormSchema>;

export const emptyQuoteItemFormValues: QuoteItemFormValues = {
	name: '',
	description: '',
};

export function quoteFormFieldError(
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
