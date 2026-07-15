import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { Plus, ShoppingCart } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { OrderCard } from '@/components/orders/order-card';
import type { OrderFormSheetHandle } from '@/components/orders/order-form-sheet';
import { OrderFormSheet } from '@/components/orders/order-form-sheet';
import {
	ORDER_STATUSES,
	type OrderStatus,
	type ProjectOrder,
} from '@/components/orders/types';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { MultiSelect } from '@/components/ui/multi-select';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS = ORDER_STATUSES.map((value) => ({ value, label: value }));

function OrdersBody({ projectId }: { projectId: Id<'projects'> }) {
	const orders = useQuery(api.projectOrders.list.list, { projectId }) as
		| ProjectOrder[]
		| undefined;

	const colors = useThemeColors();
	const formSheetRef = useRef<OrderFormSheetHandle>(null);

	const [search, setSearch] = useState('');
	const [filterStatuses, setFilterStatuses] = useState<OrderStatus[]>([]);

	const trimmedSearch = search.trim().toLowerCase();

	// Flat, newest-first list (the query returns descending by creation).
	const filteredOrders = useMemo(() => {
		if (!orders) {
			return [];
		}
		return orders.filter((order) => {
			if (
				filterStatuses.length > 0 &&
				!filterStatuses.includes(order.status as OrderStatus)
			) {
				return false;
			}
			if (
				trimmedSearch &&
				!order.orderId.toLowerCase().includes(trimmedSearch)
			) {
				return false;
			}
			return true;
		});
	}, [orders, trimmedSearch, filterStatuses]);

	if (orders === undefined) {
		return <ListSkeleton />;
	}

	const toggleStatus = (value: OrderStatus) =>
		setFilterStatuses((prev) =>
			prev.includes(value)
				? prev.filter((status) => status !== value)
				: [...prev, value]
		);

	const emptyDescription =
		orders.length === 0
			? 'Tap the + button to add an order.'
			: 'No orders match your filters.';

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pt-2 pb-3">
				<View className="flex-row items-center gap-2">
					<MultiSelect
						className="flex-1"
						onToggle={toggleStatus}
						options={STATUS_OPTIONS}
						placeholder="All statuses"
						title="Filter by status"
						values={filterStatuses}
					/>
					<Pressable
						accessibilityLabel="Add order"
						accessibilityRole="button"
						className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
						hitSlop={4}
						onPress={() => formSheetRef.current?.present()}
					>
						<Plus color={colors.foreground} size={18} strokeWidth={2} />
					</Pressable>
				</View>
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search by order ID (LHA-XXXXXX)"
					value={search}
				/>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={filteredOrders}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description={emptyDescription}
						icon={ShoppingCart}
						title="No orders"
					/>
				}
				renderItem={({ item }) => <OrderCard order={item} />}
			/>
			<OrderFormSheet projectId={projectId} ref={formSheetRef} />
		</View>
	);
}

export default function OrdersScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return <OrdersBody projectId={projectId as Id<'projects'>} />;
}
