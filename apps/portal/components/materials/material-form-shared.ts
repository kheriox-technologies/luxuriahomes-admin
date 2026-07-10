import { z } from 'zod';

const priceField = z
	.string()
	.min(1, 'Price is required')
	.refine(
		(v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
		'Price must be a positive number'
	);

export const materialFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	tradeId: z.string().min(1, 'Trade is required'),
	unit: z.string().min(1, 'Unit is required'),
	price: priceField,
	vendor: z.string().trim().min(1, 'Vendor is required'),
	sku: z.string().optional(),
	link: z.string().optional(),
});

export type MaterialFormValues = z.infer<typeof materialFormSchema>;

export const emptyMaterialFormValues: MaterialFormValues = {
	name: '',
	description: '',
	tradeId: '',
	unit: '',
	price: '',
	vendor: '',
	sku: '',
	link: '',
};

export const materialItemDraftSchema = z.object({
	name: z.string().trim().min(1, 'Item name is required'),
	description: z.string().optional(),
	vendor: z.string().trim().min(1, 'Vendor is required'),
	unit: z.string().min(1, 'Unit is required'),
	price: priceField,
	quantity: z
		.string()
		.min(1, 'Quantity is required')
		.refine(
			(v) => !Number.isNaN(Number(v)) && Number(v) > 0,
			'Quantity must be a positive number'
		),
	sku: z.string().optional(),
	link: z.string().optional(),
});

export type MaterialItemDraftValues = z.infer<typeof materialItemDraftSchema>;

export const emptyMaterialItemDraft: MaterialItemDraftValues = {
	name: '',
	description: '',
	vendor: '',
	unit: '',
	price: '',
	quantity: '',
	sku: '',
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
