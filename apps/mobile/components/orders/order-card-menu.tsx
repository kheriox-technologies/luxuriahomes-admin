import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
	EllipsisVertical,
	FileText,
	History,
	Mail,
	MessageSquareText,
	RefreshCw,
} from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { useOrderActions } from './order-actions-provider';
import type { ProjectOrder } from './types';

export function OrderCardMenu({ order }: { order: ProjectOrder }) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);
	const {
		openStatusPicker,
		openNotes,
		openStatusHistory,
		viewOrderPdf,
		emailOrder,
	} = useOrderActions();

	const run = (action: () => void) => () => {
		sheetRef.current?.dismiss();
		action();
	};

	return (
		<>
			<Pressable
				accessibilityLabel="Order actions"
				accessibilityRole="button"
				className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
				hitSlop={6}
				onPress={() => sheetRef.current?.present()}
			>
				<EllipsisVertical
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
			</Pressable>
			<ActionSheet
				items={[
					{
						key: 'status',
						label: 'Update status',
						icon: RefreshCw,
						onPress: run(() => openStatusPicker(order)),
					},
					{
						key: 'notes',
						label: 'View / edit notes',
						icon: MessageSquareText,
						onPress: run(() => openNotes(order)),
					},
					{
						key: 'history',
						label: 'View status history',
						icon: History,
						onPress: run(() => openStatusHistory(order)),
					},
					{
						key: 'view',
						label: 'View order',
						icon: FileText,
						onPress: run(() => {
							viewOrderPdf(order);
						}),
					},
					{
						key: 'email',
						label: 'Email order',
						icon: Mail,
						onPress: run(() => {
							emailOrder(order);
						}),
					},
				]}
				ref={sheetRef}
				title={`${order.orderId} · ${order.vendor}`}
			/>
		</>
	);
}
