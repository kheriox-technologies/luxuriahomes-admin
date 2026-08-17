import { z } from 'zod';

// Percent is held as a string so the input can be cleared to "not set".
const PERCENT_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;
const MAX_PERCENT = 100;
const MAX_SCOPE_SUMMARY_LENGTH = 160;

export const quoteStageFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	defaultPercent: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === '' ||
				(PERCENT_PATTERN.test(value) && Number(value) <= MAX_PERCENT),
			'Enter a percentage between 0 and 100'
		),
	scopeSummary: z
		.string()
		.trim()
		.max(
			MAX_SCOPE_SUMMARY_LENGTH,
			`Keep the scope under ${MAX_SCOPE_SUMMARY_LENGTH} characters`
		),
});

export type QuoteStageFormValues = z.infer<typeof quoteStageFormSchema>;

export const emptyQuoteStageFormValues: QuoteStageFormValues = {
	name: '',
	defaultPercent: '',
	scopeSummary: '',
};

/** Form string → mutation arg; an empty input clears the stored value. */
export function parseOptionalPercent(value: string): number | undefined {
	const trimmed = value.trim();
	return trimmed === '' ? undefined : Number(trimmed);
}

export const quoteSectionFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type QuoteSectionFormValues = z.infer<typeof quoteSectionFormSchema>;

export const emptyQuoteSectionFormValues: QuoteSectionFormValues = {
	name: '',
};

export const quoteItemFormSchema = z.object({
	name: z.string().trim().min(1, 'Item text is required'),
});

export type QuoteItemFormValues = z.infer<typeof quoteItemFormSchema>;

export const emptyQuoteItemFormValues: QuoteItemFormValues = {
	name: '',
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
