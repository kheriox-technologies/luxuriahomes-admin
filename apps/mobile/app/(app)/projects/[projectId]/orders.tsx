import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { ChevronsDown, ChevronsUp, ShoppingCart } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { OrderTradeAccordion } from '@/components/orders/order-trade-accordion';
import {
	ORDER_STATUSES,
	type OrderGroup,
	type OrderStatus,
	type ProjectOrder,
} from '@/components/orders/types';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { MultiSelect } from '@/components/ui/multi-select';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS = ORDER_STATUSES.map((value) => ({ value, label: value }));

function ToolbarIconButton({
	icon: Icon,
	label,
	onPress,
}: {
	icon: LucideIcon;
	label: string;
	onPress: () => void;
}) {
	const colors = useThemeColors();
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
			hitSlop={4}
			onPress={onPress}
		>
			<Icon color={colors.foreground} size={18} strokeWidth={2} />
		</Pressable>
	);
}

function OrdersBody({ projectId }: { projectId: Id<'projects'> }) {
	const orders = useQuery(api.projectOrders.list.list, { projectId }) as
		| ProjectOrder[]
		| undefined;
	const tradeSummary = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	});

	const [search, setSearch] = useState('');
	const [filterTradeIds, setFilterTradeIds] = useState<Id<'trades'>[]>([]);
	const [filterStatuses, setFilterStatuses] = useState<OrderStatus[]>([]);
	const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());

	const budgetByTradeId = useMemo(() => {
		const map = new Map<
			Id<'trades'>,
			{ budgetPrice: number | null; xeroActual: number | null }
		>();
		for (const row of tradeSummary ?? []) {
			map.set(row.tradeId, {
				budgetPrice: row.budgetPrice,
				xeroActual: row.xeroActual,
			});
		}
		return map;
	}, [tradeSummary]);

	// Trade filter options come from the trades that actually have orders.
	const tradeOptions = useMemo(() => {
		const map = new Map<Id<'trades'>, string>();
		for (const order of orders ?? []) {
			map.set(order.tradeId, order.tradeName);
		}
		return [...map.entries()]
			.map(([value, label]) => ({ value, label }))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [orders]);

	const trimmedSearch = search.trim().toLowerCase();

	const groups = useMemo<OrderGroup[]>(() => {
		if (!orders) {
			return [];
		}
		const filtered = orders.filter((order) => {
			if (
				filterTradeIds.length > 0 &&
				!filterTradeIds.includes(order.tradeId)
			) {
				return false;
			}
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

		const map = new Map<string, OrderGroup>();
		for (const order of filtered) {
			const key = order.tradeId as string;
			let group = map.get(key);
			if (!group) {
				const budget = budgetByTradeId.get(order.tradeId);
				group = {
					key,
					tradeId: order.tradeId,
					tradeName: order.tradeName,
					orders: [],
					budgetPrice: budget?.budgetPrice ?? null,
					xeroActual: budget?.xeroActual ?? null,
				};
				map.set(key, group);
			}
			group.orders.push(order);
		}
		return [...map.values()].sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
	}, [orders, trimmedSearch, filterTradeIds, filterStatuses, budgetByTradeId]);

	if (orders === undefined) {
		return <ListSkeleton />;
	}

	const toggleTrade = (value: Id<'trades'>) =>
		setFilterTradeIds((prev) =>
			prev.includes(value)
				? prev.filter((id) => id !== value)
				: [...prev, value]
		);
	const toggleStatus = (value: OrderStatus) =>
		setFilterStatuses((prev) =>
			prev.includes(value)
				? prev.filter((status) => status !== value)
				: [...prev, value]
		);
	const toggleKey = (key: string) =>
		setCollapsedKeys((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	const expandAll = () => setCollapsedKeys(new Set());
	const collapseAll = () =>
		setCollapsedKeys(new Set(groups.map((group) => group.key)));

	const emptyDescription =
		orders.length === 0
			? 'Purchase orders created in the web portal will appear here.'
			: 'No orders match your filters.';

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pt-2 pb-3">
				<View className="flex-row items-center gap-2">
					<MultiSelect
						className="flex-1"
						onToggle={toggleTrade}
						options={tradeOptions}
						placeholder="All trades"
						title="Filter by trade"
						values={filterTradeIds}
					/>
					<MultiSelect
						className="flex-1"
						onToggle={toggleStatus}
						options={STATUS_OPTIONS}
						placeholder="All statuses"
						title="Filter by status"
						values={filterStatuses}
					/>
					<ToolbarIconButton
						icon={ChevronsDown}
						label="Expand all trades"
						onPress={expandAll}
					/>
					<ToolbarIconButton
						icon={ChevronsUp}
						label="Collapse all trades"
						onPress={collapseAll}
					/>
				</View>
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search by order ID (LHA-XXXXXX)"
					value={search}
				/>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={groups}
				keyExtractor={(item) => item.key}
				ListEmptyComponent={
					<EmptyState
						description={emptyDescription}
						icon={ShoppingCart}
						title="No orders"
					/>
				}
				renderItem={({ item }) => (
					<OrderTradeAccordion
						expanded={!collapsedKeys.has(item.key)}
						group={item}
						onToggle={() => toggleKey(item.key)}
					/>
				)}
			/>
		</View>
	);
}

export default function OrdersScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return <OrdersBody projectId={projectId as Id<'projects'>} />;
}
