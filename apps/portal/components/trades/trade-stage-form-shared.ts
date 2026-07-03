import type { Doc, Id } from '@workspace/backend/dataModel';
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

export interface TradeStageGroup {
	items: Doc<'trades'>[];
	key: string;
	value: string;
}

const MAX_TRADE_ORDER = Number.MAX_SAFE_INTEGER;

function compareTrades(a: Doc<'trades'>, b: Doc<'trades'>): number {
	const byOrder = (a.order ?? MAX_TRADE_ORDER) - (b.order ?? MAX_TRADE_ORDER);
	if (byOrder !== 0) {
		return byOrder;
	}
	return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

/**
 * Group trades by their stage for a grouped combobox: stage groups ordered by
 * the stage list, trades within a group sorted by `(order, name)`. Only
 * non-empty groups are returned, with an "Ungrouped" group appended last when
 * there are stage-less trades. Shape matches Base UI's grouped-items API
 * (`{ value, items }`).
 */
export function groupTradesByStage(
	stages: Doc<'tradeStages'>[] | undefined,
	trades: Doc<'trades'>[] | undefined
): TradeStageGroup[] {
	const stageList = stages ?? [];
	const tradeList = trades ?? [];
	const byStage = new Map<Id<'tradeStages'>, Doc<'trades'>[]>();
	const ungrouped: Doc<'trades'>[] = [];
	for (const trade of tradeList) {
		if (trade.stageId) {
			const list = byStage.get(trade.stageId) ?? [];
			list.push(trade);
			byStage.set(trade.stageId, list);
		} else {
			ungrouped.push(trade);
		}
	}
	const groups: TradeStageGroup[] = [];
	for (const stage of stageList) {
		const stageTrades = byStage.get(stage._id);
		if (stageTrades && stageTrades.length > 0) {
			groups.push({
				key: stage._id,
				value: stage.name,
				items: [...stageTrades].sort(compareTrades),
			});
		}
	}
	if (ungrouped.length > 0) {
		groups.push({
			key: UNGROUPED_KEY,
			value: 'Ungrouped',
			items: [...ungrouped].sort(compareTrades),
		});
	}
	return groups;
}

export interface TradeIdStageGroup {
	items: Id<'trades'>[];
	key: string;
	value: string;
}

/**
 * Same grouping as {@link groupTradesByStage}, but each group's `items` is a list
 * of trade ids — for comboboxes whose selected value is `Id<'trades'>` rather
 * than the full document.
 */
export function groupTradeIdsByStage(
	stages: Doc<'tradeStages'>[] | undefined,
	trades: Doc<'trades'>[] | undefined
): TradeIdStageGroup[] {
	return groupTradesByStage(stages, trades).map((group) => ({
		key: group.key,
		value: group.value,
		items: group.items.map((trade) => trade._id),
	}));
}
