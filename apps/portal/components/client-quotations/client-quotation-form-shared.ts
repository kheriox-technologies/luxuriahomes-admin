import type { Doc } from '@workspace/backend/dataModel';
import { z } from 'zod';
import { AUSTRALIAN_STATES } from '@/components/projects/project-form-shared';

// Numeric inputs are held as strings so a half-typed value ("1.") doesn't
// collapse to NaN mid-keystroke — the same convention the other money forms use.
const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;
const PERCENT_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;
const POSTCODE_PATTERN = /^\d{4}$/;
const VALIDITY_PATTERN = /^\d{1,3}$/;

export const MAX_QUOTATION_CLIENTS = 4;
export const COVER_DESCRIPTION_MAX_LENGTH = 400;
export const DEFAULT_VALIDITY_DAYS = '30';
export const QUOTATION_FOLDER_NAME = 'Client Quotations';
export const REQUIRED_PERCENT_TOTAL = 100;
// Percentages are entered to two decimals; anything closer than this is rounding.
export const PERCENT_EPSILON = 0.005;

const australianStateSchema = z.enum(
	AUSTRALIAN_STATES as unknown as [string, ...string[]]
);

export const quotationClientSchema = z.object({
	name: z.string().trim().min(1, 'Client name is required'),
	email: z.string().trim().email('Enter a valid email'),
	phone: z.string().trim().min(1, 'Phone is required'),
});

export const clientQuotationFormSchema = z.object({
	projectName: z.string().trim().min(1, 'Project name is required'),
	description: z
		.string()
		.trim()
		.max(
			COVER_DESCRIPTION_MAX_LENGTH,
			`Keep the cover description under ${COVER_DESCRIPTION_MAX_LENGTH} characters`
		),
	clients: z
		.array(quotationClientSchema)
		.min(1)
		.max(
			MAX_QUOTATION_CLIENTS,
			`A quotation can list at most ${MAX_QUOTATION_CLIENTS} clients`
		),
	address: z.object({
		street: z.string().trim().min(1, 'Street is required'),
		suburb: z.string().trim().min(1, 'Suburb is required'),
		state: australianStateSchema,
		postcode: z
			.string()
			.trim()
			.regex(POSTCODE_PATTERN, 'Postcode must be 4 digits'),
	}),
	validityDays: z
		.string()
		.trim()
		.regex(VALIDITY_PATTERN, 'Enter a whole number of days'),
	budgetTemplateId: z.string(),
	marginPercent: z
		.string()
		.trim()
		.refine(
			(value) => value === '' || PERCENT_PATTERN.test(value),
			'Enter a valid margin'
		),
	totalInclGst: z
		.string()
		.trim()
		.regex(MONEY_PATTERN, 'Enter a valid amount')
		.refine((value) => Number(value) > 0, 'Total must be greater than zero'),
});

export type ClientQuotationFormValues = z.infer<
	typeof clientQuotationFormSchema
>;

export const emptyQuotationClient: ClientQuotationFormValues['clients'][number] =
	{
		name: '',
		email: '',
		phone: '',
	};

export const emptyClientQuotationFormValues: ClientQuotationFormValues = {
	projectName: '',
	description: '',
	clients: [{ ...emptyQuotationClient }],
	address: { street: '', suburb: '', state: 'QLD', postcode: '' },
	validityDays: DEFAULT_VALIDITY_DAYS,
	budgetTemplateId: '',
	marginPercent: '',
	totalInclGst: '',
};

/**
 * The stored quotation, mapped back to the form's string-based values so an
 * issued quotation can be revised. Numbers become strings for the same reason
 * they are typed as strings — a half-edited "1." must survive a keystroke.
 */
export function formValuesFromQuotation(
	quotation: Doc<'clientQuotations'>
): ClientQuotationFormValues {
	return {
		projectName: quotation.projectName,
		description: quotation.description ?? '',
		clients: quotation.clients.map((client) => ({
			name: client.name,
			email: client.email,
			phone: client.phone,
		})),
		address: {
			street: quotation.address.street,
			suburb: quotation.address.suburb,
			state: quotation.address.state,
			postcode: quotation.address.postcode,
		},
		validityDays: String(quotation.validityDays),
		budgetTemplateId: quotation.budgetTemplateId ?? '',
		marginPercent:
			quotation.marginPercent === undefined
				? ''
				: String(quotation.marginPercent),
		totalInclGst: String(quotation.totalInclGst),
	};
}

export function quotationFieldError(
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

export function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

export function parseMoney(value: string): number {
	const parsed = Number(value.trim());
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Template total plus margin — the starting point for the quoted price. */
export function applyMargin(
	templateTotal: number,
	marginPercent: number
): number {
	return round2(templateTotal * (1 + marginPercent / 100));
}

/**
 * Splits the total across the stages, pushing any rounding remainder onto the
 * last one so the printed column always sums to the printed total.
 */
export function computeStageAmounts(
	total: number,
	percents: number[]
): number[] {
	const amounts = percents.map((percent) => round2((total * percent) / 100));
	if (amounts.length === 0) {
		return amounts;
	}
	const sum = amounts.reduce((acc, amount) => acc + amount, 0);
	amounts[amounts.length - 1] = round2((amounts.at(-1) ?? 0) + (total - sum));
	return amounts;
}

/** All prices are inclusive of GST, so both lines are derived from the total. */
export function splitGst(totalInclGst: number): {
	contractSumExclGst: number;
	gstAmount: number;
} {
	const contractSumExclGst = round2(totalInclGst / 1.1);
	return {
		contractSumExclGst,
		gstAmount: round2(totalInclGst - contractSumExclGst),
	};
}

export function formatIssueDate(date: Date): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(date);
}
