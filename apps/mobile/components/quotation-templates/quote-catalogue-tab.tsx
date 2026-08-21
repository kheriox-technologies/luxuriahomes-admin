import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	ArrowDown,
	ArrowUp,
	Check,
	ChevronDown,
	ChevronRight,
	ChevronsDown,
	ChevronsUp,
	ListTree,
	MoreVertical,
	Plus,
	SquarePen,
	Trash2,
	TriangleAlert,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import { convexErrorMessage } from '@/lib/project-form';
import {
	QuoteEntrySheet,
	type QuoteEntrySheetHandle,
} from './quote-entry-sheet';
import {
	QuoteStageSheet,
	type QuoteStageSheetHandle,
} from './quote-stage-sheet';

type StageId = Id<'quoteStages'>;
type SectionId = Id<'quoteSections'>;
type ItemId = Id<'quoteItems'>;

const REQUIRED_PERCENT_TOTAL = 100;

type Target =
	| {
			kind: 'stage';
			id: StageId;
			index: number;
			text: string;
			defaultPercent: number | null;
			scopeSummary: string | null;
	  }
	| {
			kind: 'section';
			id: SectionId;
			index: number;
			stageId: StageId;
			siblings: SectionId[];
			text: string;
	  }
	| {
			kind: 'item';
			id: ItemId;
			index: number;
			isDefault: boolean;
			sectionId: SectionId;
			siblings: ItemId[];
			text: string;
	  };

function reordered<T>(ids: T[], from: number, to: number): T[] {
	const next = ids.slice();
	const [moved] = next.splice(from, 1);
	next.splice(to, 0, moved as T);
	return next;
}

/**
 * The Items tab — stages, the sections under them, and the items under those.
 *
 * `quoteCatalogue.tree` returns the whole thing in one round trip, which is what
 * makes a three-level accordion practical on a phone. Everything starts
 * collapsed: a seeded template runs to well over a hundred items, and a wall of
 * them is not a useful thing to land on.
 *
 * Items marked "Default" are the ones a new quotation starts with ticked; the
 * rest are there to be added per quotation.
 */
export function QuoteCatalogueTab({ templateId: raw }: { templateId: string }) {
	const colors = useThemeColors();
	const templateId = raw as Id<'quoteTemplates'>;

	const tree = useQuery(api.quoteCatalogue.tree.tree, { templateId });

	const removeStage = useMutation(api.quoteStages.remove.remove);
	const reorderStages = useMutation(api.quoteStages.reorder.reorder);
	const addSection = useMutation(api.quoteSections.add.add);
	const updateSection = useMutation(api.quoteSections.update.update);
	const removeSection = useMutation(api.quoteSections.remove.remove);
	const reorderSections = useMutation(api.quoteSections.reorder.reorder);
	const addItem = useMutation(api.quoteItems.add.add);
	const updateItem = useMutation(api.quoteItems.update.update);
	const removeItem = useMutation(api.quoteItems.remove.remove);
	const reorderItems = useMutation(api.quoteItems.reorder.reorder);
	const toggleDefault = useMutation(api.quoteItems.toggleDefault.toggleDefault);

	const [search, setSearch] = useState('');
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [target, setTarget] = useState<Target | null>(null);
	const [addSectionTo, setAddSectionTo] = useState<StageId | null>(null);
	const [addItemTo, setAddItemTo] = useState<SectionId | null>(null);

	const menuRef = useRef<BottomSheetModal>(null);
	const stageSheetRef = useRef<QuoteStageSheetHandle>(null);
	const sectionSheetRef = useRef<QuoteEntrySheetHandle>(null);
	const itemSheetRef = useRef<QuoteEntrySheetHandle>(null);

	const trimmedSearch = search.trim().toLowerCase();

	// Searching filters items and keeps the sections and stages that still have
	// one, so a hit is always shown in the context it lives in.
	const filtered = useMemo(() => {
		if (!tree) {
			return [];
		}
		if (!trimmedSearch) {
			return tree;
		}
		return tree
			.map((stage) => ({
				...stage,
				sections: stage.sections
					.map((section) => ({
						...section,
						items: section.items.filter((item) =>
							item.name.toLowerCase().includes(trimmedSearch)
						),
					}))
					.filter(
						(section) =>
							section.items.length > 0 ||
							section.section.name.toLowerCase().includes(trimmedSearch)
					),
			}))
			.filter(
				(stage) =>
					stage.sections.length > 0 ||
					stage.stage.name.toLowerCase().includes(trimmedSearch)
			);
	}, [tree, trimmedSearch]);

	const percentTotal = useMemo(
		() =>
			(tree ?? []).reduce(
				(sum, stage) => sum + (stage.stage.defaultPercent ?? 0),
				0
			),
		[tree]
	);
	const percentsBalanced =
		tree === undefined || tree.length === 0
			? true
			: Math.abs(percentTotal - REQUIRED_PERCENT_TOTAL) < 0.005;

	const toggle = (key: string) =>
		setExpanded((current) => {
			const next = new Set(current);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});

	const expandAll = () =>
		setExpanded(
			new Set(
				(tree ?? []).flatMap((stage) => [
					stage.stage._id as string,
					...stage.sections.map((section) => section.section._id as string),
				])
			)
		);
	const collapseAll = () => setExpanded(new Set());

	const fail = (message: string) => (error: unknown) =>
		Alert.alert(message, convexErrorMessage(error, 'Please try again.'));

	const move = (delta: number) => {
		if (!(target && tree)) {
			return;
		}
		if (target.kind === 'stage') {
			const to = target.index + delta;
			if (to < 0 || to >= tree.length) {
				return;
			}
			reorderStages({
				stageIds: reordered(
					tree.map((row) => row.stage._id),
					target.index,
					to
				),
			}).catch(fail('Could not reorder stages'));
			return;
		}
		if (target.kind === 'section') {
			const to = target.index + delta;
			if (to < 0 || to >= target.siblings.length) {
				return;
			}
			reorderSections({
				updates: reordered(target.siblings, target.index, to).map(
					(sectionId, order) => ({
						sectionId,
						stageId: target.stageId,
						order,
					})
				),
			}).catch(fail('Could not reorder sections'));
			return;
		}
		const to = target.index + delta;
		if (to < 0 || to >= target.siblings.length) {
			return;
		}
		reorderItems({
			updates: reordered(target.siblings, target.index, to).map(
				(itemId, order) => ({ itemId, sectionId: target.sectionId, order })
			),
		}).catch(fail('Could not reorder items'));
	};

	const confirmDelete = () => {
		if (!target) {
			return;
		}
		const messages: Record<Target['kind'], string> = {
			stage: `This deletes "${target.text}", every section under it and all of their items.`,
			section: `This deletes "${target.text}" and every item under it.`,
			item: target.text,
		};
		Alert.alert(`Delete ${target.kind}?`, messages[target.kind], [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					let promise: Promise<unknown>;
					if (target.kind === 'stage') {
						promise = removeStage({ stageId: target.id });
					} else if (target.kind === 'section') {
						promise = removeSection({ sectionId: target.id });
					} else {
						promise = removeItem({ itemId: target.id });
					}
					promise.catch(fail('Could not delete'));
				},
			},
		]);
	};

	const siblingCount = (() => {
		if (!target) {
			return 0;
		}
		if (target.kind === 'stage') {
			return tree?.length ?? 0;
		}
		return target.siblings.length;
	})();

	const menuItems: ActionSheetItem[] = target
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: SquarePen,
					onPress: () => {
						if (target.kind === 'stage') {
							stageSheetRef.current?.present({
								stageId: target.id,
								name: target.text,
								defaultPercent: target.defaultPercent,
								scopeSummary: target.scopeSummary,
							});
						} else if (target.kind === 'section') {
							sectionSheetRef.current?.present(target.text, target.id);
						} else {
							itemSheetRef.current?.present(target.text, target.id);
						}
					},
				},
				...(target.kind === 'item'
					? [
							{
								key: 'default',
								label: target.isDefault
									? 'Remove from defaults'
									: 'Include by default',
								icon: Check,
								onPress: () => {
									toggleDefault({
										itemId: target.id,
										isDefault: !target.isDefault,
									}).catch(fail('Could not update the item'));
								},
							},
						]
					: []),
				{
					key: 'up',
					label: 'Move up',
					icon: ArrowUp,
					disabled: target.index <= 0,
					onPress: () => move(-1),
				},
				{
					key: 'down',
					label: 'Move down',
					icon: ArrowDown,
					disabled: target.index >= siblingCount - 1,
					onPress: () => move(1),
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: confirmDelete,
				},
			]
		: [];

	if (tree === undefined) {
		return <ListSkeleton />;
	}

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pb-3">
				<View className="flex-row items-center gap-2">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search items"
						value={search}
					/>
				</View>
				<View className="flex-row items-center justify-end gap-2">
					<ToolbarIconButton
						icon={ChevronsDown}
						label="Expand all"
						onPress={expandAll}
					/>
					<ToolbarIconButton
						icon={ChevronsUp}
						label="Collapse all"
						onPress={collapseAll}
					/>
					<ToolbarIconButton
						icon={Plus}
						label="Add stage"
						onPress={() => stageSheetRef.current?.present()}
					/>
				</View>
			</View>

			{percentsBalanced ? null : (
				<View className="mx-4 mb-3 flex-row items-center gap-2 rounded-lg border border-border bg-muted p-3">
					<TriangleAlert color={colors.destructive} size={16} strokeWidth={2} />
					<Text className="flex-1 font-sans text-foreground text-xs">
						The stage percentages total {percentTotal}%. A quotation cannot be
						issued until they total 100%.
					</Text>
				</View>
			)}

			<FlatList
				contentContainerClassName="pb-6"
				data={filtered}
				keyExtractor={(row) => row.stage._id}
				ListEmptyComponent={
					<EmptyState
						description={
							trimmedSearch
								? 'Try a different search.'
								: 'Add a stage, then the sections and items that go under it.'
						}
						icon={ListTree}
						title={trimmedSearch ? 'No matching items' : 'No stages yet'}
					/>
				}
				renderItem={({ item: stageRow, index: stageIndex }) => {
					const stageOpen = expanded.has(stageRow.stage._id);
					const sectionIds = stageRow.sections.map(
						(section) => section.section._id
					);
					const itemCount = stageRow.sections.reduce(
						(sum, section) => sum + section.items.length,
						0
					);

					return (
						<Animated.View className="mx-4 mb-2" layout={LinearTransition}>
							<Card className="overflow-hidden">
								<View className="flex-row items-center gap-2 p-3.5">
									<Pressable
										accessibilityLabel={
											stageOpen
												? `Collapse ${stageRow.stage.name}`
												: `Expand ${stageRow.stage.name}`
										}
										accessibilityRole="button"
										className="flex-1 flex-row items-center gap-2"
										hitSlop={8}
										onPress={() => toggle(stageRow.stage._id)}
									>
										{stageOpen ? (
											<ChevronDown
												color={colors.mutedForeground}
												size={16}
												strokeWidth={2}
											/>
										) : (
											<ChevronRight
												color={colors.mutedForeground}
												size={16}
												strokeWidth={2}
											/>
										)}
										<Text className="flex-1 font-sans-semibold text-foreground text-sm">
											{stageRow.stage.name}
										</Text>
										{stageRow.stage.defaultPercent === undefined ? null : (
											<Badge variant="info">
												{`${stageRow.stage.defaultPercent}%`}
											</Badge>
										)}
										<Badge variant="outline">{String(itemCount)}</Badge>
									</Pressable>
									<Pressable
										accessibilityLabel={`Add section to ${stageRow.stage.name}`}
										accessibilityRole="button"
										hitSlop={8}
										onPress={() => {
											setAddSectionTo(stageRow.stage._id);
											sectionSheetRef.current?.present();
										}}
									>
										<Plus color={colors.foreground} size={18} strokeWidth={2} />
									</Pressable>
									<Pressable
										accessibilityLabel={`Actions for ${stageRow.stage.name}`}
										accessibilityRole="button"
										hitSlop={8}
										onPress={() => {
											setTarget({
												kind: 'stage',
												id: stageRow.stage._id,
												index: stageIndex,
												text: stageRow.stage.name,
												defaultPercent: stageRow.stage.defaultPercent ?? null,
												scopeSummary: stageRow.stage.scopeSummary ?? null,
											});
											menuRef.current?.present();
										}}
									>
										<MoreVertical
											color={colors.mutedForeground}
											size={18}
											strokeWidth={2}
										/>
									</Pressable>
								</View>

								{stageOpen ? (
									<View className="border-border border-t">
										{stageRow.stage.scopeSummary ? (
											<Text className="px-3.5 pt-3 font-sans text-muted-foreground text-xs">
												{stageRow.stage.scopeSummary}
											</Text>
										) : null}
										{stageRow.sections.length === 0 ? (
											<Text className="p-3.5 font-sans text-muted-foreground text-xs">
												No sections in this stage yet.
											</Text>
										) : (
											stageRow.sections.map((sectionRow, sectionIndex) => {
												const sectionOpen = expanded.has(
													sectionRow.section._id
												);
												const itemIds = sectionRow.items.map(
													(item) => item._id
												);
												return (
													<View
														className="border-border border-t"
														key={sectionRow.section._id}
													>
														<View className="flex-row items-center gap-2 py-2.5 pr-3.5 pl-6">
															<Pressable
																accessibilityLabel={
																	sectionOpen
																		? `Collapse ${sectionRow.section.name}`
																		: `Expand ${sectionRow.section.name}`
																}
																accessibilityRole="button"
																className="flex-1 flex-row items-center gap-2"
																hitSlop={8}
																onPress={() => toggle(sectionRow.section._id)}
															>
																{sectionOpen ? (
																	<ChevronDown
																		color={colors.mutedForeground}
																		size={14}
																		strokeWidth={2}
																	/>
																) : (
																	<ChevronRight
																		color={colors.mutedForeground}
																		size={14}
																		strokeWidth={2}
																	/>
																)}
																<Text className="font-sans text-muted-foreground text-xs tabular-nums">
																	{stageIndex + 1}.{sectionIndex + 1}
																</Text>
																<Text className="flex-1 font-sans-medium text-foreground text-sm">
																	{sectionRow.section.name}
																</Text>
																<Badge variant="outline">
																	{String(sectionRow.items.length)}
																</Badge>
															</Pressable>
															<Pressable
																accessibilityLabel={`Add item to ${sectionRow.section.name}`}
																accessibilityRole="button"
																hitSlop={8}
																onPress={() => {
																	setAddItemTo(sectionRow.section._id);
																	itemSheetRef.current?.present();
																}}
															>
																<Plus
																	color={colors.foreground}
																	size={16}
																	strokeWidth={2}
																/>
															</Pressable>
															<Pressable
																accessibilityLabel={`Actions for ${sectionRow.section.name}`}
																accessibilityRole="button"
																hitSlop={8}
																onPress={() => {
																	setTarget({
																		kind: 'section',
																		id: sectionRow.section._id,
																		index: sectionIndex,
																		stageId: stageRow.stage._id,
																		siblings: sectionIds,
																		text: sectionRow.section.name,
																	});
																	menuRef.current?.present();
																}}
															>
																<MoreVertical
																	color={colors.mutedForeground}
																	size={16}
																	strokeWidth={2}
																/>
															</Pressable>
														</View>

														{sectionOpen ? (
															<View className="gap-2 pr-3.5 pb-3 pl-10">
																{sectionRow.items.length === 0 ? (
																	<Text className="font-sans text-muted-foreground text-xs">
																		No items in this section yet.
																	</Text>
																) : (
																	sectionRow.items.map((item, itemIndex) => (
																		<View
																			className="flex-row items-center gap-2"
																			key={item._id}
																		>
																			<Text
																				className={
																					item.isDefault
																						? 'flex-1 font-sans text-foreground text-sm'
																						: 'flex-1 font-sans text-muted-foreground text-sm'
																				}
																			>
																				{item.name}
																			</Text>
																			{item.isDefault ? (
																				<Badge variant="success">Default</Badge>
																			) : null}
																			<Pressable
																				accessibilityLabel={`Actions for ${item.name}`}
																				accessibilityRole="button"
																				hitSlop={8}
																				onPress={() => {
																					setTarget({
																						kind: 'item',
																						id: item._id,
																						index: itemIndex,
																						isDefault: item.isDefault,
																						sectionId: sectionRow.section._id,
																						siblings: itemIds,
																						text: item.name,
																					});
																					menuRef.current?.present();
																				}}
																			>
																				<MoreVertical
																					color={colors.mutedForeground}
																					size={16}
																					strokeWidth={2}
																				/>
																			</Pressable>
																		</View>
																	))
																)}
															</View>
														) : null}
													</View>
												);
											})
										)}
									</View>
								) : null}
							</Card>
						</Animated.View>
					);
				}}
			/>

			<ActionSheet items={menuItems} ref={menuRef} title={target?.text} />
			<QuoteStageSheet ref={stageSheetRef} templateId={templateId} />
			<QuoteEntrySheet
				label="Section name"
				onSubmit={(text, sectionId) => {
					if (sectionId) {
						return updateSection({
							sectionId: sectionId as SectionId,
							name: text,
						});
					}
					if (!addSectionTo) {
						return Promise.resolve();
					}
					return addSection({ stageId: addSectionTo, name: text });
				}}
				placeholder="e.g. Earthworks"
				ref={sectionSheetRef}
				title="Add section"
			/>
			<QuoteEntrySheet
				label="Item"
				onSubmit={(text, itemId) => {
					if (itemId) {
						// `update` needs the flag too, so keep whatever the row had.
						return updateItem({
							itemId: itemId as ItemId,
							name: text,
							isDefault: target?.kind === 'item' ? target.isDefault : true,
						});
					}
					if (!addItemTo) {
						return Promise.resolve();
					}
					// New items are included by default — that is what makes a template
					// worth having; the exceptions get unticked afterwards.
					return addItem({ sectionId: addItemTo, name: text, isDefault: true });
				}}
				placeholder="e.g. Slab pour"
				ref={itemSheetRef}
				title="Add item"
			/>
		</View>
	);
}

function ToolbarIconButton({
	icon: Icon,
	label,
	onPress,
}: {
	icon: typeof Plus;
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
