import { z } from 'zod';

export const materialFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	unit: z.string().min(1, 'Unit is required'),
});

export type MaterialFormValues = z.infer<typeof materialFormSchema>;

export const emptyMaterialFormValues: MaterialFormValues = {
	name: '',
	description: '',
	unit: '',
};

export const materialVariantFormSchema = z
	.object({
		name: z.string().trim().min(1, 'Variant name is required'),
		description: z.string().optional(),
		vendor: z.string(),
		newVendorName: z.string().optional(),
		link: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (!(data.vendor.trim() || data.newVendorName?.trim())) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Vendor is required',
				path: ['vendor'],
			});
		}
	});

export type MaterialVariantFormValues = z.infer<
	typeof materialVariantFormSchema
>;

export const emptyMaterialVariantFormValues: MaterialVariantFormValues = {
	name: '',
	description: '',
	vendor: '',
	newVendorName: '',
	link: '',
};

export const materialItemDraftSchema = z
	.object({
		name: z.string().trim().min(1, 'Item name is required'),
		description: z.string().optional(),
		vendor: z.string(),
		newVendorName: z.string().optional(),
		unit: z.string().min(1, 'Unit is required'),
		link: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (!(data.vendor.trim() || data.newVendorName?.trim())) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Vendor is required',
				path: ['vendor'],
			});
		}
	});

export type MaterialItemDraftValues = z.infer<typeof materialItemDraftSchema>;

export const emptyMaterialItemDraft: MaterialItemDraftValues = {
	name: '',
	description: '',
	vendor: '',
	newVendorName: '',
	unit: '',
	link: '',
};

export function materialFormFieldError(
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

export function materialItemDraftErrorMessage(
	error: z.ZodError<MaterialItemDraftValues>
): string {
	return error.issues.map((i) => i.message).join(' ');
}

export function formatItemCountBadgeLabel(count: number): string {
	return count === 1 ? '1 Item' : `${count} Items`;
}
