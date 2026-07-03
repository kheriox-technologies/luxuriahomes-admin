import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { ChipBar } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { OrderStatusPill } from '@/components/ui/status-pill';
import { formatShortDate } from '@/lib/format';

type ProjectOrder = Doc<'projectOrders'>;

const STATUS_FILTERS = [
	'All',
	'Pending',
	'Ordered',
	'In Transit',
	'Delivered',
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function OrderCard({ order }: { order: ProjectOrder }) {
	const itemsLabel =
		order.items.length === 1 ? '1 item' : `${order.items.length} items`;
	return (
		<Card className="mx-4 mb-2 gap-2 p-3.5">
			<View className="flex-row items-center justify-between gap-2">
				<Text className="flex-1 font-sans-semibold text-foreground text-sm">
					{order.orderId} · {order.vendor}
				</Text>
				<OrderStatusPill status={order.status} />
			</View>
			<Text className="font-sans text-muted-foreground text-xs">
				{itemsLabel}
				{order.orderBy ? ` · Order by ${formatShortDate(order.orderBy)}` : ''}
				{order.deliverBy
					? ` · Deliver by ${formatShortDate(order.deliverBy)}`
					: ''}
			</Text>
			{order.items.slice(0, 3).map((item) => (
				<Text
					className="font-sans text-muted-foreground text-xs"
					key={item.name}
					numberOfLines={1}
				>
					• {item.name} × {item.quantity} {item.unit}
				</Text>
			))}
			{order.items.length > 3 ? (
				<Text className="font-sans text-muted-foreground text-xs">
					+{order.items.length - 3} more
				</Text>
			) : null}
		</Card>
	);
}

export default function OrdersScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const orders = useQuery(api.projectOrders.list.list, {
		projectId: projectId as Id<'projects'>,
	}) as ProjectOrder[] | undefined;
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

	const filtered = useMemo(() => {
		if (!orders) {
			return [];
		}
		if (statusFilter === 'All') {
			return orders;
		}
		return orders.filter((order) => order.status === statusFilter);
	}, [orders, statusFilter]);

	if (orders === undefined) {
		return <ListSkeleton />;
	}

	return (
		<View className="flex-1">
			<View className="pb-3">
				<ChipBar
					onSelect={setStatusFilter}
					options={STATUS_FILTERS}
					selected={statusFilter}
				/>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={filtered}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description={
							statusFilter === 'All'
								? 'Purchase orders created in the web portal will appear here.'
								: `No ${statusFilter.toLowerCase()} orders.`
						}
						icon={ShoppingCart}
						title="No orders"
					/>
				}
				renderItem={({ item }) => <OrderCard order={item} />}
			/>
		</View>
	);
}
