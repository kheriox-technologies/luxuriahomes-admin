import { z } from 'zod';

export const serviceProviderContactSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	email: z.string().trim().email('Valid email required'),
	phone: z.string().trim().min(1, 'Phone is required'),
	position: z.string().trim().optional(),
});

export type ContactDraftValues = z.infer<typeof serviceProviderContactSchema>;

export const emptyContactDraft: ContactDraftValues = {
	name: '',
	email: '',
	phone: '',
	position: '',
};

export const serviceProviderFormSchema = z.object({
	company: z.string().trim().min(1, 'Company is required'),
	name: z.string().trim().min(1, 'Name is required'),
	email: z.string().trim().email('Valid email required'),
	phone: z.string().trim().min(1, 'Phone is required'),
	position: z.string().trim().optional(),
	qbccLicense: z.string().trim().optional(),
	website: z.string().trim().optional(),
});

export type ServiceProviderFormValues = z.infer<
	typeof serviceProviderFormSchema
>;

export const emptyServiceProviderFormValues: ServiceProviderFormValues = {
	company: '',
	name: '',
	email: '',
	phone: '',
	position: '',
	qbccLicense: '',
	website: '',
};

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
