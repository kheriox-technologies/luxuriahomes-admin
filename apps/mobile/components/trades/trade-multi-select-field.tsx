import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Check, ChevronDown, Plus, X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/text-field';
import { cn } from '@/lib/cn';

type Trade = Doc<'trades'>;
type TradeStage = Doc<'tradeStages'>;

const UNGROUPED_KEY = '__ungrouped__';

interface TradeGroup {
	key: string;
	label: string;
	trades: Trade[];
}

/**
 * The single source of truth for picking MULTIPLE trades on mobile. A pressable
 * field that shows the selected trades as chips and opens a stacked bottom-sheet
 * picker with search, stage grouping, toggle selection, and — when `allowCreate`
 * is set — an inline "New trade" flow (name + stage, with an option to create a
 * new stage). The multi-select counterpart of {@link TradeSelectField}; mirrors
 * the portal `TradeSelect` with `multiple`. Self-contained: owns its own data
 * queries and create mutations.
 */
export function TradeMultiSelectField({
	values,
	onValuesChange,
	allowCreate,
	excludeTradeIds,
	disabled,
	invalid,
	placeholder = 'Select trades',
}: {
	values: Id<'trades'>[];
	onValuesChange: (next: Id<'trades'>[]) => void;
	allowCreate?: boolean;
	excludeTradeIds?: Id<'trades'>[];
	disabled?: boolean;
	invalid?: boolean;
	placeholder?: string;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const trades = useQuery(api.trades.list.list, {}) as Trade[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {}) as
		| TradeStage[]
		| undefined;
	const addTrade = useMutation(api.trades.add.add);
	const addStage = useMutation(api.tradeStages.add.add);

	const [search, setSearch] = useState('');
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [newStageId, setNewStageId] = useState<Id<'tradeStages'> | ''>('');
	const [newStageName, setNewStageName] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeTradeIds ?? []),
		[excludeTradeIds]
	);

	const nameById = useMemo(
		() => new Map((trades ?? []).map((trade) => [trade._id, trade.name])),
		[trades]
	);

	const selectedTrades = useMemo(
		() =>
			values
				.map((id) => ({ id, name: nameById.get(id) ?? '' }))
				.filter((trade) => trade.name !== ''),
		[values, nameById]
	);

	const trimmedSearch = search.trim().toLowerCase();

	const groups = useMemo<TradeGroup[]>(() => {
		if (!trades) {
			return [];
		}
		const available = trades.filter(
			(trade) =>
				!excludeSet.has(trade._id) &&
				(trimmedSearch
					? trade.name.toLowerCase().includes(trimmedSearch)
					: true)
		);
		const stageOrder = new Map<string, number>();
		(stages ?? []).forEach((stage, index) => {
			stageOrder.set(stage._id, index);
		});
		const stageNames = new Map(
			(stages ?? []).map((stage) => [stage._id as string, stage.name])
		);

		const map = new Map<string, TradeGroup>();
		for (const trade of available) {
			const key = trade.stageId ?? UNGROUPED_KEY;
			let group = map.get(key);
			if (!group) {
				group = {
					key,
					label: trade.stageId
						? (stageNames.get(trade.stageId) ?? 'Ungrouped')
						: 'Ungrouped',
					trades: [],
				};
				map.set(key, group);
			}
			group.trades.push(trade);
		}
		for (const group of map.values()) {
			group.trades.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
		}
		return [...map.values()].sort((a, b) => {
			if (a.key === UNGROUPED_KEY) {
				return 1;
			}
			if (b.key === UNGROUPED_KEY) {
				return -1;
			}
			return (stageOrder.get(a.key) ?? 0) - (stageOrder.get(b.key) ?? 0);
		});
	}, [trades, stages, excludeSet, trimmedSearch]);

	const stageOptions = useMemo(
		() =>
			(stages ?? []).map((stage) => ({
				value: stage._id as string,
				label: stage.name,
			})),
		[stages]
	);

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const resetCreate = () => {
		setCreating(false);
		setNewName('');
		setNewStageId('');
		setNewStageName('');
	};

	const open = () => {
		setSearch('');
		resetCreate();
		sheetRef.current?.present();
	};

	const toggle = (tradeId: Id<'trades'>) => {
		onValuesChange(
			values.includes(tradeId)
				? values.filter((id) => id !== tradeId)
				: [...values, tradeId]
		);
	};

	const handleCreate = async () => {
		const name = newName.trim();
		if (!name) {
			Alert.alert('Enter a trade name');
			return;
		}
		setIsSaving(true);
		try {
			const stageName = newStageName.trim();
			let stageId: Id<'tradeStages'> | undefined;
			if (stageName) {
				stageId = await addStage({ name: stageName });
			} else if (newStageId) {
				stageId = newStageId;
			}
			const tradeId = await addTrade({ name, stageId });
			onValuesChange([...values, tradeId]);
			resetCreate();
		} catch {
			Alert.alert('Could not create trade', 'Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Pressable
				accessibilityLabel={placeholder}
				accessibilityRole="button"
				accessibilityState={{ disabled }}
				className={cn(
					'min-h-9 flex-row items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 active:bg-muted',
					invalid ? 'border-destructive' : 'border-border',
					disabled && 'opacity-50'
				)}
				disabled={disabled}
				hitSlop={4}
				onPress={open}
			>
				<View className="flex-1 flex-row flex-wrap items-center gap-1">
					{selectedTrades.length === 0 ? (
						<Text
							className="font-sans text-muted-foreground text-xs"
							numberOfLines={1}
						>
							{placeholder}
						</Text>
					) : (
						selectedTrades.map((trade) => (
							<View
								className="h-6 shrink-0 flex-row items-center rounded-md bg-muted px-2"
								key={trade.id}
							>
								<Text
									className="max-w-[140px] font-sans-medium text-foreground text-xs"
									numberOfLines={1}
								>
									{trade.name}
								</Text>
							</View>
						))
					)}
				</View>
				<ChevronDown color={colors.mutedForeground} size={16} strokeWidth={2} />
			</Pressable>

			<BottomSheetModal
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.card }}
				enableDynamicSizing
				handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
				keyboardBehavior="interactive"
				maxDynamicContentSize={640}
				ref={sheetRef}
				stackBehavior="push"
				topInset={insets.top}
			>
				<BottomSheetScrollView
					className="px-4 pt-1"
					contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
					keyboardShouldPersistTaps="handled"
				>
					<Text className="px-1 pb-3 font-sans-semibold text-base text-foreground">
						{creating ? 'New trade' : 'Select trades'}
					</Text>

					{creating ? (
						<View className="gap-3">
							<TextField
								label="Trade name"
								onChangeText={setNewName}
								placeholder="e.g. Electrical"
								value={newName}
							/>
							<View className="gap-1.5">
								<Text className="font-sans-medium text-foreground text-sm">
									Stage
								</Text>
								<Select
									onChange={(next) => {
										setNewStageId(next as Id<'tradeStages'>);
										setNewStageName('');
									}}
									options={stageOptions}
									placeholder="No stage"
									title="Select stage"
									value={newStageId}
								/>
							</View>
							<TextField
								label="Or create a new stage"
								onChangeText={(text) => {
									setNewStageName(text);
									if (text.trim()) {
										setNewStageId('');
									}
								}}
								placeholder="New stage name (optional)"
								value={newStageName}
							/>
							<View className="flex-row gap-2 pt-1">
								<Button
									className="flex-1"
									icon={
										<X color={colors.foreground} size={18} strokeWidth={2} />
									}
									onPress={resetCreate}
								>
									Cancel
								</Button>
								<Button
									className="flex-1"
									icon={
										<Plus color={colors.foreground} size={18} strokeWidth={2} />
									}
									loading={isSaving}
									onPress={handleCreate}
								>
									Create
								</Button>
							</View>
						</View>
					) : (
						<>
							<View className="pb-2">
								<SearchBar
									onChangeText={setSearch}
									placeholder="Search trades"
									value={search}
								/>
							</View>
							{allowCreate ? (
								<Button
									className="mb-2"
									icon={
										<Plus color={colors.foreground} size={18} strokeWidth={2} />
									}
									onPress={() => setCreating(true)}
								>
									New trade
								</Button>
							) : null}
							{trades === undefined ? (
								<Text className="py-3 font-sans text-muted-foreground text-sm">
									Loading…
								</Text>
							) : null}
							{trades !== undefined && groups.length === 0 ? (
								<Text className="py-3 font-sans text-muted-foreground text-sm">
									No trades found.
								</Text>
							) : null}
							{groups.map((group) => (
								<View className="pb-2" key={group.key}>
									<Text className="px-1 pb-1 font-sans-medium text-muted-foreground text-xs uppercase">
										{group.label}
									</Text>
									{group.trades.map((trade) => {
										const selected = values.includes(trade._id);
										return (
											<Pressable
												accessibilityLabel={trade.name}
												accessibilityRole="button"
												accessibilityState={{ selected }}
												className={cn(
													'min-h-[44px] flex-row items-center justify-between gap-3 rounded-lg px-3 active:bg-muted',
													selected && 'bg-muted'
												)}
												key={trade._id}
												onPress={() => toggle(trade._id)}
											>
												<Text
													className="flex-1 font-sans-medium text-foreground text-xs"
													numberOfLines={1}
												>
													{trade.name}
												</Text>
												{selected ? (
													<Check
														color={colors.foreground}
														size={18}
														strokeWidth={2}
													/>
												) : null}
											</Pressable>
										);
									})}
								</View>
							))}
						</>
					)}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
}
