import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
	ChevronsDown,
	ChevronsUp,
	Handshake,
	Link2,
	MoreVertical,
	UserPlus,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import {
	AddServiceProviderSheet,
	type AddServiceProviderSheetHandle,
} from '@/components/service-providers/add-service-provider-sheet';
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
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
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

function ServiceProvidersBody({ projectId }: { projectId: Id<'projects'> }) {
	const providers = useQuery(api.projectServiceProviders.listByProject.list, {
		projectId,
	}) as ServiceProvider[] | undefined;
	const trades = useQuery(api.trades.list.list, {});

	const [search, setSearch] = useState('');
	const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());
	const addSheetRef = useRef<AddServiceProviderSheetHandle>(null);
	const createSheetRef = useRef<CreateServiceProviderSheetHandle>(null);
	const menuRef = useRef<BottomSheetModal>(null);
	const linkProvider = useMutation(api.projectServiceProviders.add.add);

	const tradeMap = useMemo(() => {
		return new Map((trades ?? []).map((trade) => [trade._id, trade.name]));
	}, [trades]);

	const linkedIds = useMemo(
		() => new Set((providers ?? []).map((provider) => provider._id)),
		[providers]
	);

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

	if (providers === undefined) {
		return <ListSkeleton />;
	}

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

	const menuItems: ActionSheetItem[] = [
		{
			key: 'add-existing',
			label: 'Add Existing',
			icon: Link2,
			onPress: () => {
				menuRef.current?.dismiss();
				addSheetRef.current?.present();
			},
		},
		{
			key: 'new',
			label: 'New Service Provider',
			icon: UserPlus,
			onPress: () => {
				menuRef.current?.dismiss();
				createSheetRef.current?.present();
			},
		},
	];

	const emptyDescription =
		providers.length === 0
			? 'Add a service provider to link them to this project.'
			: 'No service providers match your search.';

	return (
		<View className="flex-1">
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
					<ToolbarIconButton
						icon={MoreVertical}
						label="Add service provider"
						onPress={() => menuRef.current?.present()}
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
						expanded={!collapsedKeys.has(item.key)}
						group={item}
						onToggle={() => toggleKey(item.key)}
						projectId={projectId}
					/>
				)}
			/>
			<AddServiceProviderSheet
				linkedIds={linkedIds}
				projectId={projectId}
				ref={addSheetRef}
			/>
			<CreateServiceProviderSheet
				onCreated={({ id }) => {
					linkProvider({ projectId, serviceProviderId: id }).catch(() =>
						Alert.alert(
							'Unable to link',
							'Provider created but could not be linked to this project.'
						)
					);
				}}
				ref={createSheetRef}
			/>
			<ActionSheet
				items={menuItems}
				ref={menuRef}
				title="Add service provider"
			/>
		</View>
	);
}

export default function ServiceProvidersScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return <ServiceProvidersBody projectId={projectId as Id<'projects'>} />;
}
