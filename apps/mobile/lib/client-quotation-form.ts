import type { Doc } from '@workspace/backend/dataModel';
import { type AustralianState, isAustralianState } from './project-form';

// Mirrors apps/portal/components/client-quotations/client-quotation-form-shared.ts,
// but with no zod and no UI dependencies — mobile validates with plain functions
// the way lib/project-form.ts does. The arithmetic below is copied verbatim
// rather than reimplemented: the portal, this module and the server all have to
// agree on what a quotation totals, and the server re-derives the GST split from
// whatever total it is sent.

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;
const PERCENT_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;
const POSTCODE_PATTERN = /^\d{4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_QUOTATION_CLIENTS = 4;
export const COVER_DESCRIPTION_MAX_LENGTH = 400;
export const REQUIRED_PERCENT_TOTAL = 100;
// Percentages are entered to two decimals; anything closer than this is rounding.
export const PERCENT_EPSILON = 0.005;
export const MAX_VERSION_DESCRIPTION_LENGTH = 200;

export interface QuotationClientDraft {
	email: string;
	name: string;
	phone: string;
}

export interface QuotationAddressDraft {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
}

export interface ClientQuotationFormValues {
	address: QuotationAddressDraft;
	// Held as strings so a half-typed "1." survives a keystroke, the same
	// convention the other money forms use.
	budgetAmount: string;
	budgetTemplateId: string;
	clients: QuotationClientDraft[];
	description: string;
	marginPercent: string;
	projectName: string;
}

export const emptyQuotationClient: QuotationClientDraft = {
	name: '',
	email: '',
	phone: '',
};

export const emptyClientQuotationFormValues: ClientQuotationFormValues = {
	projectName: '',
	description: '',
	clients: [{ ...emptyQuotationClient }],
	address: { street: '', suburb: '', state: 'QLD', postcode: '' },
	budgetTemplateId: '',
	marginPercent: '',
	budgetAmount: '',
};

/**
 * Field errors keyed the way the screen renders them: scalar fields by name,
 * client fields as `clients.<index>.<field>` and address fields as
 * `address.<field>`. Empty means the form is valid.
 */
export type QuotationFormErrors = Record<string, string>;

export function validateClientQuotationForm(
	values: ClientQuotationFormValues
): QuotationFormErrors {
	const errors: QuotationFormErrors = {};

	if (!values.projectName.trim()) {
		errors.projectName = 'Project name is required';
	}
	if (values.description.trim().length > COVER_DESCRIPTION_MAX_LENGTH) {
		errors.description = `Keep the cover description under ${COVER_DESCRIPTION_MAX_LENGTH} characters`;
	}

	if (values.clients.length === 0) {
		errors.clients = 'A quotation needs at least one client';
	}
	if (values.clients.length > MAX_QUOTATION_CLIENTS) {
		errors.clients = `A quotation can list at most ${MAX_QUOTATION_CLIENTS} clients`;
	}
	for (const [index, client] of values.clients.entries()) {
		if (!client.name.trim()) {
			errors[`clients.${index}.name`] = 'Client name is required';
		}
		if (!EMAIL_PATTERN.test(client.email.trim())) {
			errors[`clients.${index}.email`] = 'Enter a valid email';
		}
		if (!client.phone.trim()) {
			errors[`clients.${index}.phone`] = 'Phone is required';
		}
	}

	if (!values.address.street.trim()) {
		errors['address.street'] = 'Street is required';
	}
	if (!values.address.suburb.trim()) {
		errors['address.suburb'] = 'Suburb is required';
	}
	if (!isAustralianState(values.address.state)) {
		errors['address.state'] = 'Select a state';
	}
	if (!POSTCODE_PATTERN.test(values.address.postcode.trim())) {
		errors['address.postcode'] = 'Postcode must be 4 digits';
	}

	const margin = values.marginPercent.trim();
	if (margin !== '' && !PERCENT_PATTERN.test(margin)) {
		errors.marginPercent = 'Enter a valid margin';
	}

	const budget = values.budgetAmount.trim();
	if (!MONEY_PATTERN.test(budget)) {
		errors.budgetAmount = 'Enter a valid amount';
	} else if (Number(budget) <= 0) {
		errors.budgetAmount = 'Budget must be greater than zero';
	}

	return errors;
}

/** The address, once validation has confirmed the state is a real one. */
export function parsedAddress(values: ClientQuotationFormValues): {
	postcode: string;
	state: AustralianState;
	street: string;
	suburb: string;
} {
	return {
		street: values.address.street.trim(),
		suburb: values.address.suburb.trim(),
		state: values.address.state as AustralianState,
		postcode: values.address.postcode.trim(),
	};
}

/**
 * The stored quotation, mapped back to the form's string-based values so an
 * issued quotation can be revised.
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
		budgetTemplateId: quotation.budgetTemplateId ?? '',
		marginPercent:
			quotation.marginPercent === undefined
				? ''
				: String(quotation.marginPercent),
		budgetAmount: String(quotation.budgetAmount),
	};
}

// --- Arithmetic ----------------------------------------------------------

export function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

export function parseMoney(value: string): number {
	const parsed = Number(value.trim());
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Budget plus margin — the total the quotation is priced and printed at. */
export function applyMargin(budget: number, marginPercent: number): number {
	return round2(budget * (1 + marginPercent / 100));
}

/**
 * What the special inclusions add to the contract sum. Their amounts are entered
 * at the price the client pays, so the margin does not apply on top — they are
 * added to the marked-up budget at face value.
 */
export function specialInclusionsTotal(entries: { amount: string }[]): number {
	return round2(
		entries.reduce((sum, entry) => sum + parseMoney(entry.amount), 0)
	);
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

/** Whether the stage percentages add up closely enough to issue. */
export function percentsAreValid(percents: number[]): boolean {
	if (percents.length === 0) {
		return false;
	}
	const total = round2(percents.reduce((sum, percent) => sum + percent, 0));
	return Math.abs(total - REQUIRED_PERCENT_TOTAL) <= PERCENT_EPSILON;
}
