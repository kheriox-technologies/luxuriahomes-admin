import { MessageSquareText } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { OrderStatusPill } from '@/components/ui/status-pill';
import { formatCurrency, formatShortDate } from '@/lib/format';
import { useOrderActions } from './order-actions-provider';
import { OrderCardMenu } from './order-card-menu';
import { orderTotalPrice, type ProjectOrder } from './types';

export const OrderCard = memo(function OrderCard({
	order,
}: {
	order: ProjectOrder;
}) {
	const colors = useThemeColors();
	const { openNotes } = useOrderActions();
	const itemsLabel =
		order.items.length === 1 ? '1 item' : `${order.items.length} items`;

	return (
		<Card className="mx-4 mb-2 gap-2 p-3.5">
			<View className="flex-row items-start gap-1.5">
				<Text className="flex-1 font-sans-semibold text-foreground text-sm">
					{order.orderId} · {order.vendor}
				</Text>
				<Badge variant="outline">{itemsLabel}</Badge>
				<OrderCardMenu order={order} />
			</View>
			{order.orderBy || order.deliverBy ? (
				<Text className="font-sans text-muted-foreground text-xs">
					{order.orderBy ? `Order by ${formatShortDate(order.orderBy)}` : ''}
					{order.orderBy && order.deliverBy ? ' · ' : ''}
					{order.deliverBy
						? `Deliver by ${formatShortDate(order.deliverBy)}`
						: ''}
				</Text>
			) : null}
			<View className="flex-row flex-wrap items-center gap-1.5 pt-0.5">
				<Badge variant="purple">{formatCurrency(orderTotalPrice(order))}</Badge>
				<OrderStatusPill status={order.status} />
				{order.noteCount > 0 ? (
					<Pressable
						accessibilityLabel="View or edit notes"
						accessibilityRole="button"
						hitSlop={8}
						onPress={() => openNotes(order)}
					>
						<MessageSquareText
							color={colors.mutedForeground}
							size={15}
							strokeWidth={2}
						/>
					</Pressable>
				) : null}
			</View>
		</Card>
	);
});
