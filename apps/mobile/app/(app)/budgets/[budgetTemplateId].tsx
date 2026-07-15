import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
	ArrowLeft,
	Building2,
	Check,
	ChevronsDown,
	ChevronsUp,
	Copy,
	FolderPlus,
	MoreVertical,
	Pencil,
	Plus,
	SquarePen,
	Trash2,
	Wallet,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	AddTemplateItemSheet,
	type AddTemplateItemSheetHandle,
} from '@/components/budgets/add-template-item-sheet';
import {
	AddTradeStageSheet,
	type AddTradeStageSheetHandle,
} from '@/components/budgets/add-trade-stage-sheet';
import {
	ApplyTemplateToProjectSheet,
	type ApplyTemplateToProjectSheetHandle,
} from '@/components/budgets/apply-template-to-project-sheet';
import {
	isValidMoneyString,
	parseMoneyString,
} from '@/components/budgets/budget-form-shared';
import {
	BudgetTemplateFormSheet,
	type BudgetTemplateFormSheetHandle,
} from '@/components/budgets/budget-template-form-sheet';
import {
	BudgetTemplateStageAccordion,
	type BudgetTemplateStageGroup,
	type BudgetTemplateTrade,
} from '@/components/budgets/budget-template-stage-accordion';
import {
	CopyBudgetTemplateSheet,
	type CopyBudgetTemplateSheetHandle,
} from '@/components/budgets/copy-budget-template-sheet';
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
import { formatCurrency } from '@/lib/format';

const UNGROUPED_KEY = 'ungrouped';
const NO_ORDER = Number.MAX_SAFE_INTEGER;
const UNKNOWN_TRADE = 'Unknown trade';

interface TemplateItemRow {
	_id: Id<'budgetTemplateItems'>;
	price: number;
	stageId: Id<'tradeStages'> | null;
	tradeDescription: string | null;
	tradeId: Id<'trades'>;
	tradeName: string | null;
	tradeOrder: number | null;
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

function BudgetTemplateBody({
	budgetTemplateId,
	title,
	description,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
	title: string;
	description: string | null;
}) {
	const router = useRouter();
	const colors = useThemeColors();

	const items = useQuery(
		api.budgetTemplateItems.listByTemplate.listByTemplate,
		{ budgetTemplateId }
	) as TemplateItemRow[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});

	const setPrices = useMutation(api.budgetTemplateItems.setPrices.setPrices);
	const removeItem = useMutation(api.budgetTemplateItems.remove.remove);
	const updateTrade = useMutation(api.trades.update.update);
	const removeTemplate = useMutation(api.budgetTemplates.remove.remove);

	const editing = useBudgetEditing();

	const [search, setSearch] = useState('');
	// Stages start collapsed; keys here are the ones the user has expanded.
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
	const [savingEdits, setSavingEdits] = useState(false);
	const [selectedTrade, setSelectedTrade] =
		useState<BudgetTemplateTrade | null>(null);

	const menuRef = useRef<BottomSheetModal>(null);
	const tradeMenuRef = useRef<BottomSheetModal>(null);
	const addItemRef = useRef<AddTemplateItemSheetHandle>(null);
	const stageSheetRef = useRef<AddTradeStageSheetHandle>(null);
	const editTradeRef = useRef<EditTradeSheetHandle>(null);
	const formSheetRef = useRef<BudgetTemplateFormSheetHandle>(null);
	const copySheetRef = useRef<CopyBudgetTemplateSheetHandle>(null);
	const applySheetRef = useRef<ApplyTemplateToProjectSheetHandle>(null);

	const trimmedSearch = search.trim().toLowerCase();
	const { isEditing, priceDrafts } = editing;

	const { groups, total } = useMemo(() => {
		if (!(items && stages)) {
			return { groups: [] as BudgetTemplateStageGroup[], total: 0 };
		}

		// While editing, a valid draft overrides the saved price so subtotals and
		// the total update live as the user types.
		const priceOf = (item: TemplateItemRow) => {
			if (isEditing) {
				const raw = (priceDrafts[item.tradeId] ?? '').trim();
				if (raw.length > 0 && isValidMoneyString(raw)) {
					return parseMoneyString(raw);
				}
			}
			return item.price;
		};

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
				subtotal += priceOf(item);
				return {
					budgetTemplateItemId: item._id,
					tradeId: item.tradeId,
					tradeName: item.tradeName ?? UNKNOWN_TRADE,
					price: item.price,
					stageId: item.stageId,
					tradeDescription: item.tradeDescription,
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
	}, [items, stages, trimmedSearch, isEditing, priceDrafts]);

	const usedTradeIds = useMemo(
		() => (items ?? []).map((item) => item.tradeId),
		[items]
	);

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

	const startEditing = () => {
		editing.begin(
			groups.flatMap((group) =>
				group.trades.map((trade) => ({
					tradeId: trade.tradeId,
					name: trade.tradeName,
					price: trade.price,
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
					budgetTemplateId,
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

	const handleDeleteItem = (trade: BudgetTemplateTrade) => {
		Alert.alert(
			'Remove trade?',
			`This removes ${trade.tradeName} from this template.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => {
						removeItem({
							budgetTemplateItemId: trade.budgetTemplateItemId,
						}).catch(() =>
							Alert.alert('Could not remove', 'Please try again.')
						);
					},
				},
			]
		);
	};

	const handleDeleteTemplate = () => {
		Alert.alert(
			'Delete template?',
			`This permanently deletes ${title} and all of its trade prices.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeTemplate({ budgetTemplateId })
							.then(() => router.back())
							.catch(() =>
								Alert.alert('Could not delete', 'Please try again.')
							);
					},
				},
			]
		);
	};

	const menuItems: ActionSheetItem[] = [
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
			key: 'add-trade',
			label: 'Add trade',
			icon: Plus,
			onPress: () => {
				menuRef.current?.dismiss();
				addItemRef.current?.present();
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
			key: 'copy',
			label: 'Copy template',
			icon: Copy,
			onPress: () => {
				menuRef.current?.dismiss();
				copySheetRef.current?.present({
					sourceBudgetTemplateId: budgetTemplateId,
					title,
				});
			},
		},
		{
			key: 'apply',
			label: 'Add to project',
			icon: Building2,
			onPress: () => {
				menuRef.current?.dismiss();
				applySheetRef.current?.present({ budgetTemplateId, title });
			},
		},
		{
			key: 'edit-template',
			label: 'Edit template',
			icon: SquarePen,
			onPress: () => {
				menuRef.current?.dismiss();
				formSheetRef.current?.present({ budgetTemplateId, title, description });
			},
		},
		{
			key: 'delete-template',
			label: 'Delete template',
			icon: Trash2,
			destructive: true,
			onPress: () => {
				menuRef.current?.dismiss();
				handleDeleteTemplate();
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
						editTradeRef.current?.present({
							tradeId: selectedTrade.tradeId,
							name: selectedTrade.tradeName,
							description: selectedTrade.tradeDescription,
							stageId: selectedTrade.stageId,
						});
					},
				},
				{
					key: 'delete-item',
					label: 'Remove from template',
					icon: Trash2,
					destructive: true,
					onPress: () => {
						tradeMenuRef.current?.dismiss();
						handleDeleteItem(selectedTrade);
					},
				},
			]
		: [];

	const openTradeMenu = (trade: BudgetTemplateTrade) => {
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
					{isEditing ? (
						<Pressable
							accessibilityLabel="Done editing budgets"
							accessibilityRole="button"
							className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
							disabled={savingEdits}
							hitSlop={4}
							onPress={handleDone}
						>
							{savingEdits ? (
								<ActivityIndicator color={colors.foreground} size="small" />
							) : (
								<Check color={colors.foreground} size={18} strokeWidth={2} />
							)}
						</Pressable>
					) : (
						<ToolbarIconButton
							icon={MoreVertical}
							label="Template actions"
							onPress={() => menuRef.current?.present()}
						/>
					)}
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
						description="Add a trade to start building this template."
						icon={Wallet}
						title="No trades"
					/>
				}
				renderItem={({ item }) => (
					<BudgetTemplateStageAccordion
						editing={isEditing}
						expanded={isSearching || expandedKeys.has(item.key)}
						group={item}
						nameDrafts={editing.nameDrafts}
						onChangeName={editing.setNameDraft}
						onChangePrice={editing.setPriceDraft}
						onOpenTradeMenu={openTradeMenu}
						onToggle={() => toggleKey(item.key)}
						priceDrafts={editing.priceDrafts}
					/>
				)}
			/>

			<ActionSheet items={menuItems} ref={menuRef} title="Template actions" />
			<ActionSheet
				items={tradeMenuItems}
				ref={tradeMenuRef}
				title={selectedTrade?.tradeName}
			/>
			<AddTemplateItemSheet
				budgetTemplateId={budgetTemplateId}
				excludedTradeIds={usedTradeIds}
				ref={addItemRef}
			/>
			<AddTradeStageSheet ref={stageSheetRef} />
			<EditTradeSheet ref={editTradeRef} />
			<BudgetTemplateFormSheet ref={formSheetRef} />
			<CopyBudgetTemplateSheet ref={copySheetRef} />
			<ApplyTemplateToProjectSheet ref={applySheetRef} />
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

			{template ? (
				<BudgetTemplateBody
					budgetTemplateId={templateId}
					description={template.description ?? null}
					title={template.title}
				/>
			) : (
				<ListSkeleton />
			)}
		</View>
	);
}
