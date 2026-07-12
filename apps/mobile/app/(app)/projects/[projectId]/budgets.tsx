import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { ChevronsDown, ChevronsUp, Wallet } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import {
	BudgetStageAccordion,
	type BudgetStageGroup,
} from '@/components/budgets/budget-stage-accordion';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import { useXeroAccountCodes } from '@/components/xero/use-xero-account-codes';
import { formatCurrency } from '@/lib/format';

const UNGROUPED_KEY = 'ungrouped';
const NO_ORDER = Number.MAX_SAFE_INTEGER;

interface TradeBudgetRow {
	budgetPrice: number | null;
	stageId: Id<'tradeStages'> | null;
	tradeId: Id<'trades'>;
	tradeName: string;
	tradeOrder: number | null;
	xeroAccountIds: string[];
	xeroActual: number | null;
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

function BudgetsBody({ projectId }: { projectId: Id<'projects'> }) {
	const rows = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	}) as TradeBudgetRow[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});
	const xeroLabelsById = useXeroAccountCodes();

	const [search, setSearch] = useState('');
	// Stages start collapsed; keys here are the ones the user has expanded.
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

	const trimmedSearch = search.trim().toLowerCase();

	const { groups, totalBudget, totalActual } = useMemo(() => {
		if (!(rows && stages)) {
			return {
				groups: [] as BudgetStageGroup[],
				totalBudget: 0,
				totalActual: 0,
			};
		}

		const stageNameById = new Map(
			stages.map((stage) => [stage._id, stage.name])
		);

		// Only trades with a budget set or a Xero actual are shown on mobile.
		const visible = rows.filter(
			(row) => row.budgetPrice !== null || row.xeroActual !== null
		);

		const searched = trimmedSearch
			? visible.filter((row) => {
					const stageName = row.stageId
						? (stageNameById.get(row.stageId) ?? '')
						: 'Ungrouped';
					return (
						row.tradeName.toLowerCase().includes(trimmedSearch) ||
						stageName.toLowerCase().includes(trimmedSearch)
					);
				})
			: visible;

		// Bucket trades by stage, sorted by trade order then name within each stage.
		const byStage = new Map<string, TradeBudgetRow[]>();
		for (const row of searched) {
			const key = row.stageId ?? UNGROUPED_KEY;
			const bucket = byStage.get(key);
			if (bucket) {
				bucket.push(row);
			} else {
				byStage.set(key, [row]);
			}
		}
		for (const bucket of byStage.values()) {
			bucket.sort((a, b) => {
				const orderDelta =
					(a.tradeOrder ?? NO_ORDER) - (b.tradeOrder ?? NO_ORDER);
				if (orderDelta !== 0) {
					return orderDelta;
				}
				return a.tradeName.localeCompare(b.tradeName, undefined, {
					sensitivity: 'base',
				});
			});
		}

		const toGroup = (
			key: string,
			name: string,
			bucket: TradeBudgetRow[]
		): BudgetStageGroup => {
			let budgetSubtotal = 0;
			let actualSubtotal = 0;
			const trades = bucket.map((row) => {
				budgetSubtotal += row.budgetPrice ?? 0;
				actualSubtotal += row.xeroActual ?? 0;
				return {
					tradeId: row.tradeId,
					tradeName: row.tradeName,
					budgetPrice: row.budgetPrice,
					actual: row.xeroActual,
					xeroAccountIds: row.xeroAccountIds,
				};
			});
			return {
				key,
				name,
				trades,
				budgetSubtotal,
				actualSubtotal,
			};
		};

		// Stage order follows tradeStages.list (already sorted by order); Ungrouped last.
		const orderedGroups: BudgetStageGroup[] = [];
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

		const grandBudget = orderedGroups.reduce(
			(sum, g) => sum + g.budgetSubtotal,
			0
		);
		const grandActual = orderedGroups.reduce(
			(sum, g) => sum + g.actualSubtotal,
			0
		);

		return {
			groups: orderedGroups,
			totalBudget: grandBudget,
			totalActual: grandActual,
		};
	}, [rows, stages, trimmedSearch]);

	if (rows === undefined || stages === undefined) {
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
					<Badge variant="purple">Budget {formatCurrency(totalBudget)}</Badge>
					<Badge
						variant={totalActual <= totalBudget ? 'success' : 'destructive'}
					>
						Actual {formatCurrency(totalActual)}
					</Badge>
				</View>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={groups}
				keyExtractor={(item) => item.key}
				ListEmptyComponent={
					<EmptyState
						description="Trade budgets set in the web portal will appear here."
						icon={Wallet}
						title="No budgets"
					/>
				}
				renderItem={({ item }) => (
					<BudgetStageAccordion
						expanded={isSearching || expandedKeys.has(item.key)}
						group={item}
						onToggle={() => toggleKey(item.key)}
						xeroLabelsById={xeroLabelsById}
					/>
				)}
			/>
		</View>
	);
}

export default function BudgetsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return <BudgetsBody projectId={projectId as Id<'projects'>} />;
}
