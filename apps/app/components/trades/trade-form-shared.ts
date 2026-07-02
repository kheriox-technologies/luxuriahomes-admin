import { z } from 'zod';

export const tradeFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().optional(),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;

export const emptyTradeFormValues: TradeFormValues = {
	name: '',
	description: '',
};

export function tradeFormFieldError(
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
