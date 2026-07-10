import { z } from 'zod';

export const serviceProviderContactSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	email: z
		.string()
		.trim()
		.refine((v) => v === '' || z.string().email().safeParse(v).success, {
			message: 'Valid email required',
		}),
	phone: z.string().trim(),
	landline: z.string().trim(),
	position: z.string().trim().optional(),
});

export type ContactDraftValues = z.infer<typeof serviceProviderContactSchema>;

export const emptyContactDraft: ContactDraftValues = {
	name: '',
	email: '',
	phone: '',
	landline: '',
	position: '',
};

export const serviceProviderFormSchema = z.object({
	company: z.string().trim().min(1, 'Company is required'),
	name: z.string().trim().min(1, 'Name is required'),
	email: z
		.string()
		.trim()
		.refine((v) => v === '' || z.string().email().safeParse(v).success, {
			message: 'Valid email required',
		}),
	phone: z.string().trim(),
	landline: z.string().trim(),
	position: z.string().trim().optional(),
	qbccLicense: z.string().trim().optional(),
	website: z.string().trim().optional(),
	address: z.string().trim().optional(),
});

export type ServiceProviderFormValues = z.infer<
	typeof serviceProviderFormSchema
>;

export const emptyServiceProviderFormValues: ServiceProviderFormValues = {
	company: '',
	name: '',
	email: '',
	phone: '',
	landline: '',
	position: '',
	qbccLicense: '',
	website: '',
	address: '',
};

export function serviceProviderLabel(p: {
	company: string;
	name?: string;
}): string {
	return p.name ? `${p.company} (${p.name})` : p.company;
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

export function contactDraftErrorMessage(
	error: import('zod').ZodError<ContactDraftValues>
): string {
	return error.issues.map((i) => i.message).join(' ');
}
