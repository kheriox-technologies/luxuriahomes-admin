import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
	ArrowLeft,
	ChevronsDown,
	ChevronsUp,
	Handshake,
	Plus,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	CreateServiceProviderSheet,
	type CreateServiceProviderSheetHandle,
} from '@/components/service-providers/create-service-provider-sheet';
import { ServiceProviderTradeAccordion } from '@/components/service-providers/service-provider-trade-accordion';
import {
	OTHER_TRADE_KEY,
	type ServiceProvider,
	type ServiceProviderGroup,
} from '@/components/service-providers/types';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

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

export default function ServiceProvidersScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const providers = useQuery(api.serviceProviders.list.list, {}) as
		| ServiceProvider[]
		| undefined;
	const trades = useQuery(api.trades.list.list, {});

	const [search, setSearch] = useState('');
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
	const createRef = useRef<CreateServiceProviderSheetHandle>(null);

	const tradeMap = useMemo(() => {
		return new Map((trades ?? []).map((trade) => [trade._id, trade.name]));
	}, [trades]);

	const trimmedSearch = search.trim().toLowerCase();

	const groups = useMemo<ServiceProviderGroup[]>(() => {
		if (!providers) {
			return [];
		}
		const filtered = providers.filter((provider) => {
			if (!trimmedSearch) {
				return true;
			}
			return (
				provider.company.toLowerCase().includes(trimmedSearch) ||
				provider.name.toLowerCase().includes(trimmedSearch)
			);
		});

		const map = new Map<string, ServiceProviderGroup>();
		const pushInto = (
			key: string,
			tradeName: string,
			provider: ServiceProvider
		) => {
			let group = map.get(key);
			if (!group) {
				group = { key, tradeName, providers: [] };
				map.set(key, group);
			}
			group.providers.push(provider);
		};

		for (const provider of filtered) {
			if (provider.tradeIds.length === 0) {
				pushInto(OTHER_TRADE_KEY, 'Other', provider);
				continue;
			}
			for (const tradeId of provider.tradeIds) {
				const tradeName = tradeMap.get(tradeId) ?? 'Other';
				pushInto(tradeId as string, tradeName, provider);
			}
		}

		return [...map.values()].sort((a, b) => {
			if (a.key === OTHER_TRADE_KEY) {
				return 1;
			}
			if (b.key === OTHER_TRADE_KEY) {
				return -1;
			}
			return a.tradeName.localeCompare(b.tradeName, undefined, {
				sensitivity: 'base',
			});
		});
	}, [providers, trimmedSearch, tradeMap]);

	const isSearching = trimmedSearch.length > 0;

	const toggleKey = (key: string) =>
		setExpandedKeys((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	const expandAll = () =>
		setExpandedKeys(new Set(groups.map((group) => group.key)));
	const collapseAll = () => setExpandedKeys(new Set());

	const emptyDescription =
		providers && providers.length === 0
			? 'Service providers added in the web portal will appear here.'
			: 'No service providers match your search.';

	return (
		<View className="flex-1 bg-background">
			<View
				className="flex-row items-center gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<Pressable
					accessibilityLabel="Back"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
					hitSlop={4}
					onPress={() => router.back()}
				>
					<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<Text className="flex-1 font-sans-bold text-2xl text-foreground">
					Service Providers
				</Text>
				<Pressable
					accessibilityLabel="New service provider"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => createRef.current?.present()}
				>
					<Plus color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
			</View>

			{providers === undefined ? (
				<ListSkeleton />
			) : (
				<>
					<View className="gap-2 px-4 pt-2 pb-3">
						<View className="flex-row items-center gap-2">
							<View className="flex-1">
								<SearchBar
									onChangeText={setSearch}
									placeholder="Search by company or contact"
									value={search}
								/>
							</View>
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
					</View>
					<FlatList
						contentContainerClassName="pb-6"
						data={groups}
						keyExtractor={(item) => item.key}
						ListEmptyComponent={
							<EmptyState
								description={emptyDescription}
								icon={Handshake}
								title="No service providers"
							/>
						}
						renderItem={({ item }) => (
							<ServiceProviderTradeAccordion
								expanded={isSearching || expandedKeys.has(item.key)}
								group={item}
								onToggle={() => toggleKey(item.key)}
							/>
						)}
					/>
				</>
			)}

			<CreateServiceProviderSheet ref={createRef} />
		</View>
	);
}
