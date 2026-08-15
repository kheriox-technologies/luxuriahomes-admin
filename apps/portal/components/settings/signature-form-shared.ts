import {
	type EmailSignatureFields,
	renderSignatureHtml,
	SIGNATURE_COMPANY,
	SIGNATURE_QBCC_LICENCE,
	SIGNATURE_WEBSITE,
} from '@workspace/backend/emailSignatureHtml';
import { z } from 'zod';

/** Renders a preview using the same renderer the mutations use server-side. */
export function renderSignaturePreview(fields: EmailSignatureFields): string {
	return renderSignatureHtml(fields);
}

export const signatureFormSchema = z.object({
	name: z.string().trim().min(1, 'Signature name is required'),
	fullName: z.string().trim().min(1, 'Full name is required'),
	designation: z.string().optional(),
	company: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
	email: z
		.string()
		.trim()
		.refine((v) => v === '' || z.string().email().safeParse(v).success, {
			message: 'Enter a valid email address',
		})
		.optional(),
	address: z.string().optional(),
	tagline: z.string().optional(),
	disclaimer: z.string().optional(),
	qbccLicence: z.string().trim().min(1, 'QBCC licence number is required'),
	website: z.string().trim().min(1, 'Website is required'),
	isDefault: z.boolean(),
});

export type SignatureFormValues = z.infer<typeof signatureFormSchema>;

export const emptySignatureFormValues: SignatureFormValues = {
	name: '',
	fullName: '',
	designation: '',
	company: SIGNATURE_COMPANY,
	mobile: '',
	phone: '',
	email: '',
	address: '',
	tagline: '',
	disclaimer: '',
	qbccLicence: SIGNATURE_QBCC_LICENCE,
	website: SIGNATURE_WEBSITE,
	isDefault: false,
};

export function signatureFormFieldError(
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

function optional(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

/** Maps form values to the structured payload the mutations expect. */
export function toSignatureFields(
	values: SignatureFormValues
): EmailSignatureFields {
	return {
		fullName: values.fullName.trim(),
		designation: optional(values.designation),
		company: optional(values.company) ?? SIGNATURE_COMPANY,
		mobile: optional(values.mobile),
		phone: optional(values.phone),
		email: optional(values.email),
		address: optional(values.address),
		tagline: optional(values.tagline),
		disclaimer: optional(values.disclaimer),
		qbccLicence: values.qbccLicence.trim() || SIGNATURE_QBCC_LICENCE,
		website: values.website.trim() || SIGNATURE_WEBSITE,
	};
}

/** Seeds the form from a stored signature so edits round-trip cleanly. */
export function toSignatureFormValues(signature: {
	name: string;
	fields: EmailSignatureFields;
	isDefault: boolean;
}): SignatureFormValues {
	const { fields } = signature;
	return {
		name: signature.name,
		fullName: fields.fullName,
		designation: fields.designation ?? '',
		company: fields.company ?? SIGNATURE_COMPANY,
		mobile: fields.mobile ?? '',
		phone: fields.phone ?? '',
		email: fields.email ?? '',
		address: fields.address ?? '',
		tagline: fields.tagline ?? '',
		disclaimer: fields.disclaimer ?? '',
		qbccLicence: fields.qbccLicence || SIGNATURE_QBCC_LICENCE,
		website: fields.website || SIGNATURE_WEBSITE,
		isDefault: signature.isDefault,
	};
}
