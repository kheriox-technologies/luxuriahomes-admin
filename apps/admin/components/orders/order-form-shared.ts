import { z } from 'zod';

export const ORDER_STATUSES = [
	'Pending',
	'Ordered',
	'In Transit',
	'Delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderItemSchema = z.object({
	name: z.string().trim().min(1, 'Item name is required'),
	description: z.string().optional(),
	quantity: z
		.string()
		.min(1, 'Quantity is required')
		.refine(
			(v) => !Number.isNaN(Number(v)) && Number(v) > 0,
			'Quantity must be a positive number'
		),
	unit: z.string().trim().min(1, 'Unit is required'),
	link: z.string().optional(),
});

export type OrderItemFormValues = z.infer<typeof orderItemSchema>;

export const orderFormSchema = z
	.object({
		vendor: z.string(),
		newVendorName: z.string().optional(),
		orderBy: z.date().optional(),
		items: z.array(orderItemSchema).min(1, 'At least one item is required'),
		status: z.enum(['Pending', 'Ordered', 'In Transit', 'Delivered']),
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

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const emptyOrderItem = {
	name: '',
	description: '',
	quantity: '',
	unit: '',
	link: '',
};

export const emptyOrderFormValues: OrderFormValues = {
	vendor: '',
	newVendorName: '',
	orderBy: undefined,
	items: [{ ...emptyOrderItem }],
	status: 'Pending',
};

export function orderFormFieldError(
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
