import { z } from 'zod';

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export const quotationStatusValues = [
	'Under Review',
	'Approved',
	'Rejected',
] as const;

export type QuotationStatus = (typeof quotationStatusValues)[number];

export const quotationFormSchema = z.object({
	projectId: z.string().min(1, 'Project is required'),
	tradeIds: z.array(z.string()).min(1, 'At least one trade is required'),
	serviceProviderId: z.string().min(1, 'Service provider is required'),
	price: z
		.string()
		.trim()
		.min(1, 'Price is required')
		.regex(MONEY_PATTERN, 'Enter a valid amount (up to 2 decimals)'),
	status: z.enum(['Under Review', 'Approved', 'Rejected']),
	s3Key: z.string().optional(),
});

export type QuotationFormValues = z.infer<typeof quotationFormSchema>;

export const emptyQuotationFormValues: QuotationFormValues = {
	projectId: '',
	tradeIds: [],
	serviceProviderId: '',
	price: '',
	status: 'Under Review',
	s3Key: undefined,
};

export function parseMoneyString(value: string): number {
	return Number(value.trim());
}

export function formatFieldErrors(
	errors: readonly unknown[] | undefined
): string {
	if (!errors || errors.length === 0) {
		return '';
	}
	return errors
		.map((e) => (e instanceof Error ? e.message : String(e ?? '')))
		.filter(Boolean)
		.join(' ');
}
