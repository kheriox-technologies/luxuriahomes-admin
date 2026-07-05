import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
	ArrowLeft,
	ChevronsDown,
	ChevronsUp,
	Wallet,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	BudgetTemplateStageAccordion,
	type BudgetTemplateStageGroup,
} from '@/components/budgets/budget-template-stage-accordion';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';

const UNGROUPED_KEY = 'ungrouped';
const NO_ORDER = Number.MAX_SAFE_INTEGER;
const UNKNOWN_TRADE = 'Unknown trade';

interface TemplateItemRow {
	price: number;
	stageId: Id<'tradeStages'> | null;
	tradeId: Id<'trades'>;
	tradeName: string | null;
	tradeOrder: number | null;
}

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

function BudgetTemplateBody({
	budgetTemplateId,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
}) {
	const items = useQuery(
		api.budgetTemplateItems.listByTemplate.listByTemplate,
		{ budgetTemplateId }
	) as TemplateItemRow[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});

	const [search, setSearch] = useState('');
	// Stages start collapsed; keys here are the ones the user has expanded.
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

	const trimmedSearch = search.trim().toLowerCase();

	const { groups, total } = useMemo(() => {
		if (!(items && stages)) {
			return { groups: [] as BudgetTemplateStageGroup[], total: 0 };
		}

		const stageNameById = new Map(
			stages.map((stage) => [stage._id, stage.name])
		);

		const searched = trimmedSearch
			? items.filter((item) => {
					const stageName = item.stageId
						? (stageNameById.get(item.stageId) ?? '')
						: 'Ungrouped';
					const tradeName = item.tradeName ?? UNKNOWN_TRADE;
					return (
						tradeName.toLowerCase().includes(trimmedSearch) ||
						stageName.toLowerCase().includes(trimmedSearch)
					);
				})
			: items;

		// Bucket trades by stage, sorted by trade order then name within each stage.
		const byStage = new Map<string, TemplateItemRow[]>();
		for (const item of searched) {
			const key = item.stageId ?? UNGROUPED_KEY;
			const bucket = byStage.get(key);
			if (bucket) {
				bucket.push(item);
			} else {
				byStage.set(key, [item]);
			}
		}
		for (const bucket of byStage.values()) {
			bucket.sort((a, b) => {
				const orderDelta =
					(a.tradeOrder ?? NO_ORDER) - (b.tradeOrder ?? NO_ORDER);
				if (orderDelta !== 0) {
					return orderDelta;
				}
				return (a.tradeName ?? UNKNOWN_TRADE).localeCompare(
					b.tradeName ?? UNKNOWN_TRADE,
					undefined,
					{ sensitivity: 'base' }
				);
			});
		}

		const toGroup = (
			key: string,
			name: string,
			bucket: TemplateItemRow[]
		): BudgetTemplateStageGroup => {
			let subtotal = 0;
			const trades = bucket.map((item) => {
				subtotal += item.price;
				return {
					tradeId: item.tradeId,
					tradeName: item.tradeName ?? UNKNOWN_TRADE,
					price: item.price,
				};
			});
			return { key, name, trades, subtotal };
		};

		// Stage order follows tradeStages.list (already sorted by order); Ungrouped last.
		const orderedGroups: BudgetTemplateStageGroup[] = [];
		for (const stage of stages) {
			const bucket = byStage.get(stage._id);
			if (bucket && bucket.length > 0) {
				orderedGroups.push(toGroup(stage._id, stage.name, bucket));
			}
		}
		const ungrouped = byStage.get(UNGROUPED_KEY);
		if (ungrouped && ungrouped.length > 0) {
			orderedGroups.push(toGroup(UNGROUPED_KEY, 'Ungrouped', ungrouped));
		}

		const grandTotal = orderedGroups.reduce((sum, g) => sum + g.subtotal, 0);

		return { groups: orderedGroups, total: grandTotal };
	}, [items, stages, trimmedSearch]);

	if (items === undefined || stages === undefined) {
		return <ListSkeleton />;
	}

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

	const isSearching = trimmedSearch.length > 0;

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pt-2 pb-3">
				<View className="flex-row items-center gap-2">
					<View className="flex-1">
						<SearchBar
							onChangeText={setSearch}
							placeholder="Search by stage or trade"
							value={search}
						/>
					</View>
					<ToolbarIconButton
						icon={ChevronsDown}
						label="Expand all stages"
						onPress={expandAll}
					/>
					<ToolbarIconButton
						icon={ChevronsUp}
						label="Collapse all stages"
						onPress={collapseAll}
					/>
				</View>
				<View className="flex-row flex-wrap items-center gap-2">
					<Badge variant="purple">Total {formatCurrency(total)}</Badge>
				</View>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={groups}
				keyExtractor={(item) => item.key}
				ListEmptyComponent={
					<EmptyState
						description="Trade prices added in the web portal will appear here."
						icon={Wallet}
						title="No trades"
					/>
				}
				renderItem={({ item }) => (
					<BudgetTemplateStageAccordion
						expanded={isSearching || expandedKeys.has(item.key)}
						group={item}
						onToggle={() => toggleKey(item.key)}
					/>
				)}
			/>
		</View>
	);
}

export default function BudgetTemplateDetailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { budgetTemplateId } = useLocalSearchParams<{
		budgetTemplateId: string;
	}>();
	const templateId = budgetTemplateId as Id<'budgetTemplates'>;
	const template = useQuery(api.budgetTemplates.get.get, {
		budgetTemplateId: templateId,
	});

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
				<View className="flex-1">
					<Text
						className="font-sans-bold text-2xl text-foreground"
						numberOfLines={1}
					>
						{template?.title ?? 'Budget template'}
					</Text>
					{template?.description ? (
						<Text
							className="font-sans text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{template.description}
						</Text>
					) : null}
				</View>
			</View>

			<BudgetTemplateBody budgetTemplateId={templateId} />
		</View>
	);
}
