import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react-native';
import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ActionSheet } from '@/components/ui/action-sheet';
import { ORDER_STATUSES, type ProjectOrder } from './types';

export interface OrderStatusSheetHandle {
	present: (order: ProjectOrder) => void;
}

export function OrderStatusSheet({
	ref,
}: {
	ref?: Ref<OrderStatusSheetHandle>;
}) {
	const sheetRef = useRef<BottomSheetModal>(null);
	const [order, setOrder] = useState<ProjectOrder | null>(null);
	const update = useMutation(api.projectOrders.update.update);

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setOrder(next);
			sheetRef.current?.present();
		},
	}));

	const changeStatus = (status: (typeof ORDER_STATUSES)[number]) => {
		if (!order || order.status === status) {
			return;
		}
		// update() requires the full order payload; resend the existing values
		// unchanged with only the new status.
		update({
			orderId: order._id,
			vendor: order.vendor,
			tradeId: order.tradeId,
			orderBy: order.orderBy,
			items: order.items,
			status,
		}).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

	return (
		<ActionSheet
			items={ORDER_STATUSES.map((status) => ({
				key: status,
				label: status,
				selected: order?.status === status,
				icon: order?.status === status ? Check : undefined,
				onPress: () => {
					sheetRef.current?.dismiss();
					changeStatus(status);
				},
			}))}
			ref={sheetRef}
			title={order ? `Update status · ${order.orderId}` : 'Update status'}
		/>
	);
}
