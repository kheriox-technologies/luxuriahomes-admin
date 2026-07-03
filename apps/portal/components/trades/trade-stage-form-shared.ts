import { z } from 'zod';

export const tradeStageFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

export type TradeStageFormValues = z.infer<typeof tradeStageFormSchema>;

export const emptyTradeStageFormValues: TradeStageFormValues = {
	name: '',
};

export function tradeStageFormFieldError(
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

// Sentinel accordion value for the bucket of trades that have no stage yet.
export const UNGROUPED_KEY = 'ungrouped';
