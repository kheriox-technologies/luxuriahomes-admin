import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
	Check,
	ChevronsDown,
	ChevronsUp,
	FolderPlus,
	MoreVertical,
	Pencil,
	Plus,
	RefreshCw,
	Trash2,
	Wallet,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	View,
} from 'react-native';
import {
	AddBudgetItemSheet,
	type AddBudgetItemSheetHandle,
} from '@/components/budgets/add-budget-item-sheet';
import {
	AddTradeStageSheet,
	type AddTradeStageSheetHandle,
} from '@/components/budgets/add-trade-stage-sheet';
import {
	BudgetStageAccordion,
	type BudgetStageGroup,
	type BudgetTrade,
} from '@/components/budgets/budget-stage-accordion';
import {
	EditTradeSheet,
	type EditTradeSheetHandle,
} from '@/components/budgets/edit-trade-sheet';
import { useBudgetEditing } from '@/components/budgets/use-budget-editing';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
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
	projectBudgetId: Id<'projectBudgets'> | null;
	stageId: Id<'tradeStages'> | null;
	tradeDescription: string | null;
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
	loading = false,
}: {
	icon: LucideIcon;
	label: string;
	onPress: () => void;
	loading?: boolean;
}) {
	const colors = useThemeColors();
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			accessibilityState={{ busy: loading }}
			className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
			disabled={loading}
			hitSlop={4}
			onPress={onPress}
		>
			{loading ? (
				<ActivityIndicator color={colors.foreground} size="small" />
			) : (
				<Icon color={colors.foreground} size={18} strokeWidth={2} />
			)}
		</Pressable>
	);
}

function DoneButton({
	loading,
	onPress,
}: {
	loading: boolean;
	onPress: () => void;
}) {
	const colors = useThemeColors();
	return (
		<Pressable
			accessibilityLabel="Done editing budgets"
			accessibilityRole="button"
			className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
			disabled={loading}
			hitSlop={4}
			onPress={onPress}
		>
			{loading ? (
				<ActivityIndicator color={colors.foreground} size="small" />
			) : (
				<Check color={colors.foreground} size={18} strokeWidth={2} />
			)}
		</Pressable>
	);
}

function BudgetsBody({ projectId }: { projectId: Id<'projects'> }) {
	const rows = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	}) as TradeBudgetRow[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});
	const project = useQuery(api.projects.get.get, { projectId });
	const xeroLabelsById = useXeroAccountCodes();

	const setPrices = useMutation(api.projectBudgets.setPrices.setPrices);
	const updateTrade = useMutation(api.trades.update.update);
	const removeBudget = useMutation(api.projectBudgets.remove.remove);
	const syncActuals = useAction(
		api.xero.syncProjectFinancialsNow.syncProjectFinancialsNow
	);

	const editing = useBudgetEditing();

	const [search, setSearch] = useState('');
	// Stages start collapsed; keys here are the ones the user has expanded.
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
	const [savingEdits, setSavingEdits] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [selectedTrade, setSelectedTrade] = useState<BudgetTrade | null>(null);

	const menuRef = useRef<BottomSheetModal>(null);
	const tradeMenuRef = useRef<BottomSheetModal>(null);
	const stageSheetRef = useRef<AddTradeStageSheetHandle>(null);
	const tradeSheetRef = useRef<AddBudgetItemSheetHandle>(null);
	const editSheetRef = useRef<EditTradeSheetHandle>(null);

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
					projectBudgetId: row.projectBudgetId,
					stageId: row.stageId,
					tradeDescription: row.tradeDescription,
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

	// Trades that already have a budget on this project — excluded from Add Trade.
	const budgetedTradeIds = useMemo(
		() =>
			(rows ?? [])
				.filter((row) => row.projectBudgetId !== null)
				.map((row) => row.tradeId),
		[rows]
	);

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

	const startEditing = () => {
		editing.begin(
			groups.flatMap((group) =>
				group.trades.map((trade) => ({
					tradeId: trade.tradeId,
					name: trade.tradeName,
					price: trade.budgetPrice,
				}))
			)
		);
		// Open every stage so all editable rows are visible.
		expandAll();
	};

	const handleDone = async () => {
		const priceChanges = editing.getPriceChanges();
		const nameChanges = editing.getNameChanges();
		setSavingEdits(true);
		try {
			if (priceChanges.length > 0) {
				await setPrices({
					projectId,
					items: priceChanges.map((change) => ({
						tradeId: change.tradeId as Id<'trades'>,
						price: change.price,
					})),
				});
			}
			for (const change of nameChanges) {
				await updateTrade({
					tradeId: change.tradeId as Id<'trades'>,
					name: change.name,
				});
			}
			editing.cancel();
		} catch {
			Alert.alert('Could not save changes', 'Please try again.');
		} finally {
			setSavingEdits(false);
		}
	};

	const handleSync = async () => {
		setSyncing(true);
		try {
			const result = await syncActuals({});
			Alert.alert(
				'Actuals synced',
				`${result.tradeActualsWritten} trade actual${
					result.tradeActualsWritten === 1 ? '' : 's'
				} updated.`
			);
		} catch {
			Alert.alert('Could not sync actuals', 'Please try again.');
		} finally {
			setSyncing(false);
		}
	};

	const handleDeleteTrade = (trade: BudgetTrade) => {
		const projectBudgetId = trade.projectBudgetId;
		if (!projectBudgetId) {
			return;
		}
		Alert.alert(
			'Remove from budget?',
			`This removes the budget for ${trade.tradeName} from this project. The trade itself is not deleted.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => {
						removeBudget({ projectBudgetId }).catch(() =>
							Alert.alert('Could not remove', 'Please try again.')
						);
					},
				},
			]
		);
	};

	const menuItems: ActionSheetItem[] = [
		{
			key: 'sync',
			label: 'Sync actuals',
			icon: RefreshCw,
			disabled: syncing,
			onPress: () => {
				menuRef.current?.dismiss();
				handleSync();
			},
		},
		{
			key: 'edit',
			label: 'Edit budgets',
			icon: Pencil,
			onPress: () => {
				menuRef.current?.dismiss();
				startEditing();
			},
		},
		{
			key: 'add-stage',
			label: 'Add stage',
			icon: FolderPlus,
			onPress: () => {
				menuRef.current?.dismiss();
				stageSheetRef.current?.present();
			},
		},
		{
			key: 'add-trade',
			label: 'Add trade',
			icon: Plus,
			onPress: () => {
				menuRef.current?.dismiss();
				tradeSheetRef.current?.present();
			},
		},
	];

	const tradeMenuItems: ActionSheetItem[] = selectedTrade
		? [
				{
					key: 'edit-trade',
					label: 'Edit trade',
					icon: Pencil,
					onPress: () => {
						tradeMenuRef.current?.dismiss();
						editSheetRef.current?.present({
							tradeId: selectedTrade.tradeId,
							name: selectedTrade.tradeName,
							description: selectedTrade.tradeDescription,
							stageId: selectedTrade.stageId,
						});
					},
				},
				{
					key: 'delete-trade',
					label: 'Remove from budget',
					icon: Trash2,
					destructive: true,
					onPress: () => {
						tradeMenuRef.current?.dismiss();
						handleDeleteTrade(selectedTrade);
					},
				},
			]
		: [];

	const openTradeMenu = (trade: BudgetTrade) => {
		setSelectedTrade(trade);
		tradeMenuRef.current?.present();
	};

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
					{editing.isEditing ? (
						<DoneButton loading={savingEdits} onPress={handleDone} />
					) : (
						<ToolbarIconButton
							icon={MoreVertical}
							label={syncing ? 'Syncing actuals' : 'Budget actions'}
							loading={syncing}
							onPress={() => menuRef.current?.present()}
						/>
					)}
				</View>
				<View className="flex-row flex-wrap items-center gap-2">
					<Badge variant="purple">B {formatCurrency(totalBudget)}</Badge>
					<Badge variant="info">
						Q {formatCurrency(project?.quotePrice ?? 0)}
					</Badge>
					<Badge
						variant={totalActual <= totalBudget ? 'success' : 'destructive'}
					>
						A {formatCurrency(totalActual)}
					</Badge>
				</View>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={groups}
				keyExtractor={(item) => item.key}
				ListEmptyComponent={
					<EmptyState
						description="Add a trade to start building this project's budget."
						icon={Wallet}
						title="No budgets"
					/>
				}
				renderItem={({ item }) => (
					<BudgetStageAccordion
						editing={editing.isEditing}
						expanded={isSearching || expandedKeys.has(item.key)}
						group={item}
						nameDrafts={editing.nameDrafts}
						onChangeName={editing.setNameDraft}
						onChangePrice={editing.setPriceDraft}
						onOpenTradeMenu={openTradeMenu}
						onToggle={() => toggleKey(item.key)}
						priceDrafts={editing.priceDrafts}
						xeroLabelsById={xeroLabelsById}
					/>
				)}
			/>

			<ActionSheet items={menuItems} ref={menuRef} title="Budget actions" />
			<ActionSheet
				items={tradeMenuItems}
				ref={tradeMenuRef}
				title={selectedTrade?.tradeName}
			/>
			<AddTradeStageSheet ref={stageSheetRef} />
			<AddBudgetItemSheet
				excludedTradeIds={budgetedTradeIds}
				projectId={projectId}
				ref={tradeSheetRef}
			/>
			<EditTradeSheet ref={editSheetRef} />
		</View>
	);
}

export default function BudgetsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return <BudgetsBody projectId={projectId as Id<'projects'>} />;
}
