import { z } from 'zod';

export const orderTaskFormSchema = z.object({
	parentTaskId: z.string().min(1, 'Parent task is required'),
	name: z.string().trim().min(1, 'Order task name is required'),
	durationDays: z
		.number()
		.int('Duration must be a whole number')
		.min(1, 'Duration must be at least 1 day'),
});

export type OrderTaskFormValues = z.infer<typeof orderTaskFormSchema>;

export const emptyOrderTaskFormValues: OrderTaskFormValues = {
	parentTaskId: '',
	name: '',
	durationDays: 1,
};

export function orderTaskFormFieldError(
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
