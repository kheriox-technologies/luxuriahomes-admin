import { useRouter } from 'expo-router';
import { ChevronRight, MessageSquareText } from 'lucide-react-native';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { OrderStatusPill } from '@/components/ui/status-pill';
import { formatCurrency, formatShortDate } from '@/lib/format';
import { orderTotalPrice, type ProjectOrder } from './types';

export const OrderCard = memo(function OrderCard({
	order,
}: {
	order: ProjectOrder;
}) {
	const colors = useThemeColors();
	const router = useRouter();
	const itemsLabel =
		order.items.length === 1 ? '1 item' : `${order.items.length} items`;

	return (
		<PressableCard
			accessibilityLabel={`Order ${order.orderId} from ${order.vendor}`}
			className="mx-4 mb-2 gap-1.5 p-3.5"
			onPress={() =>
				router.push({
					pathname: '/(app)/orders/[orderId]',
					params: { orderId: order._id },
				})
			}
		>
			<View className="flex-row items-center gap-2">
				<Text className="flex-1 font-sans-semibold text-foreground text-sm">
					{order.orderId} · {order.vendor}
				</Text>
				<ChevronRight
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
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
			<View className="flex-row flex-wrap items-center gap-1.5">
				<Badge variant="outline">{itemsLabel}</Badge>
				<Badge variant="purple">{formatCurrency(orderTotalPrice(order))}</Badge>
				<OrderStatusPill status={order.status} />
				{order.noteCount > 0 ? (
					<View className="flex-row items-center gap-1">
						<MessageSquareText
							color={colors.mutedForeground}
							size={15}
							strokeWidth={2}
						/>
						<Text className="font-sans text-muted-foreground text-xs">
							{order.noteCount}
						</Text>
					</View>
				) : null}
			</View>
		</PressableCard>
	);
});
