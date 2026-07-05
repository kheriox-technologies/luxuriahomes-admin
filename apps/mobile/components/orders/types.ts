import type { Doc, Id } from '@workspace/backend/dataModel';

// The enriched row returned by api.projectOrders.list.list — a projectOrders
// doc plus the extra fields the query resolves per row.
export type ProjectOrder = Doc<'projectOrders'> & {
	noteCount: number;
	tradeName: string;
	linkedOrderTaskName: string | null;
	linkedParentTaskName: string | null;
};

export interface OrderGroup {
	budgetPrice: number | null;
	key: string;
	orders: ProjectOrder[];
	remaining: number | null;
	tradeId: Id<'trades'>;
	tradeName: string;
}

export const ORDER_STATUSES = [
	'Pending',
	'Ordered',
	'In Transit',
	'Delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function orderTotalPrice(order: ProjectOrder): number {
	return order.items.reduce(
		(sum, item) => sum + (item.price ?? 0) * item.quantity,
		0
	);
}
