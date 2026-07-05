import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { OrderStatusPill } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/format';

type Order = Doc<'projectOrders'>;
type StatusHistory = Doc<'projectOrderStatusHistory'>;

export function OrderStatusHistorySection({ order }: { order: Order }) {
	const colors = useThemeColors();

	const history = useQuery(
		api.projectOrders.listStatusHistory.listStatusHistory,
		{ orderId: order._id }
	) as StatusHistory[] | undefined;

	return (
		<View className="gap-3">
			<Text className="font-sans-semibold text-base text-foreground">
				Status history
			</Text>

			{history === undefined ? (
				<ActivityIndicator color={colors.mutedForeground} size="small" />
			) : null}
			{history?.length === 0 ? (
				<Text className="py-2 font-sans text-muted-foreground text-sm">
					No status changes yet.
				</Text>
			) : null}
			{history?.map((entry) => (
				<View
					className="gap-1.5 rounded-xl border border-border bg-background p-3"
					key={entry._id}
				>
					<View className="flex-row items-center justify-between gap-2">
						<OrderStatusPill status={entry.status} />
						<Text className="font-sans text-muted-foreground text-xs">
							{formatDate(entry.timestamp)}
						</Text>
					</View>
					<Text className="font-sans text-muted-foreground text-xs">
						{entry.label} · {entry.changedBy}
					</Text>
				</View>
			))}
		</View>
	);
}
