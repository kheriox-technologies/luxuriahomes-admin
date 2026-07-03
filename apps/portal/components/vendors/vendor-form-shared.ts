import { z } from 'zod';

export const vendorFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	link: z.string().optional(),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;

export const emptyVendorFormValues: VendorFormValues = {
	name: '',
	description: '',
	link: '',
};

export function vendorFormFieldError(
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
