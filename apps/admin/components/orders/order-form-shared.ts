import { z } from 'zod';

export const orderFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
	materials: z
		.array(z.object({ name: z.string(), units: z.string() }))
		.default([]),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const emptyOrderFormValues: OrderFormValues = {
	name: '',
	description: '',
	materials: [],
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
