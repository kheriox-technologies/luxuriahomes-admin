import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	ArrowDown,
	ArrowUp,
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Plus,
	ScrollText,
	SquarePen,
	Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
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
import { ListSkeleton } from '@/components/ui/skeleton';
import { convexErrorMessage } from '@/lib/project-form';
import {
	QuoteEntrySheet,
	type QuoteEntrySheetHandle,
} from './quote-entry-sheet';

type TermSectionId = Id<'quoteTermSections'>;
type TermItemId = Id<'quoteTermItems'>;

/** Which row the action sheet was opened for — a section or one of its clauses. */
type Target =
	| { kind: 'section'; id: TermSectionId; index: number; text: string }
	| {
			kind: 'clause';
			id: TermItemId;
			index: number;
			sectionId: TermSectionId;
			siblings: TermItemId[];
			text: string;
	  };

function reordered<T>(ids: T[], from: number, to: number): T[] {
	const next = ids.slice();
	const [moved] = next.splice(from, 1);
	next.splice(to, 0, moved as T);
	return next;
}

/**
 * The Terms tab — sections of clauses, collapsed by default.
 *
 * Two levels rather than the items tab's three, and reordered by menu rather
 * than by drag, for the reason set out in `orderable-entry-list.tsx`.
 */
export function QuoteTermsTab({
	templateId,
}: {
	templateId: TermSectionId | string;
}) {
	const colors = useThemeColors();
	const id = templateId as Id<'quoteTemplates'>;

	const terms = useQuery(api.quoteTerms.get.get, { templateId: id });
	const addSection = useMutation(api.quoteTermSections.add.add);
	const updateSection = useMutation(api.quoteTermSections.update.update);
	const removeSection = useMutation(api.quoteTermSections.remove.remove);
	const reorderSections = useMutation(api.quoteTermSections.reorder.reorder);
	const addItem = useMutation(api.quoteTermItems.add.add);
	const updateItem = useMutation(api.quoteTermItems.update.update);
	const removeItem = useMutation(api.quoteTermItems.remove.remove);
	const reorderItems = useMutation(api.quoteTermItems.reorder.reorder);

	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [target, setTarget] = useState<Target | null>(null);
	const [addingTo, setAddingTo] = useState<TermSectionId | null>(null);

	const menuRef = useRef<BottomSheetModal>(null);
	const sectionSheetRef = useRef<QuoteEntrySheetHandle>(null);
	const clauseSheetRef = useRef<QuoteEntrySheetHandle>(null);

	const sections = terms?.sections ?? [];

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

	const fail = (message: string) => (error: unknown) =>
		Alert.alert(message, convexErrorMessage(error, 'Please try again.'));

	const moveSection = (delta: number) => {
		if (target?.kind !== 'section') {
			return;
		}
		const to = target.index + delta;
		if (to < 0 || to >= sections.length) {
			return;
		}
		reorderSections({
			sectionIds: reordered(
				sections.map((row) => row.section._id),
				target.index,
				to
			),
		}).catch(fail('Could not reorder sections'));
	};

	const moveClause = (delta: number) => {
		if (target?.kind !== 'clause') {
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
		}).catch(fail('Could not reorder clauses'));
	};

	const confirmDelete = () => {
		if (!target) {
			return;
		}
		const isSection = target.kind === 'section';
		Alert.alert(
			isSection ? 'Delete section?' : 'Delete clause?',
			isSection
				? `This deletes "${target.text}" and every clause under it.`
				: target.text,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						const promise = isSection
							? removeSection({ sectionId: target.id as TermSectionId })
							: removeItem({ itemId: target.id as TermItemId });
						promise.catch(fail('Could not delete'));
					},
				},
			]
		);
	};

	const menuItems: ActionSheetItem[] = target
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: SquarePen,
					onPress: () =>
						(target.kind === 'section'
							? sectionSheetRef
							: clauseSheetRef
						).current?.present(target.text, target.id),
				},
				{
					key: 'up',
					label: 'Move up',
					icon: ArrowUp,
					disabled: target.index <= 0,
					onPress: () =>
						target.kind === 'section' ? moveSection(-1) : moveClause(-1),
				},
				{
					key: 'down',
					label: 'Move down',
					icon: ArrowDown,
					disabled:
						target.index >=
						(target.kind === 'section'
							? sections.length
							: target.siblings.length) -
							1,
					onPress: () =>
						target.kind === 'section' ? moveClause(1) : moveClause(1),
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

	if (terms === undefined) {
		return <ListSkeleton />;
	}

	return (
		<View className="flex-1">
			<View className="flex-row items-center justify-end px-4 pb-3">
				<Pressable
					accessibilityLabel="Add section"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => sectionSheetRef.current?.present()}
				>
					<Plus color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
			</View>

			<FlatList
				contentContainerClassName="pb-6"
				data={sections}
				keyExtractor={(row) => row.section._id}
				ListEmptyComponent={
					<EmptyState
						description="Group the terms into sections, then add the clauses under each."
						icon={ScrollText}
						title="No terms yet"
					/>
				}
				renderItem={({ item: row, index: sectionIndex }) => {
					const open = expanded.has(row.section._id);
					const siblings = row.items.map((clause) => clause._id);
					return (
						<Animated.View className="mx-4 mb-2" layout={LinearTransition}>
							<Card className="overflow-hidden">
								<View className="flex-row items-center gap-2 p-3.5">
									<Pressable
										accessibilityLabel={
											open
												? `Collapse ${row.section.name}`
												: `Expand ${row.section.name}`
										}
										accessibilityRole="button"
										className="flex-1 flex-row items-center gap-2"
										hitSlop={8}
										onPress={() => toggle(row.section._id)}
									>
										{open ? (
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
											{row.section.name}
										</Text>
										<Badge variant="outline">{String(row.items.length)}</Badge>
									</Pressable>
									<Pressable
										accessibilityLabel={`Add clause to ${row.section.name}`}
										accessibilityRole="button"
										hitSlop={8}
										onPress={() => {
											setAddingTo(row.section._id);
											clauseSheetRef.current?.present();
										}}
									>
										<Plus color={colors.foreground} size={18} strokeWidth={2} />
									</Pressable>
									<Pressable
										accessibilityLabel={`Actions for ${row.section.name}`}
										accessibilityRole="button"
										hitSlop={8}
										onPress={() => {
											setTarget({
												kind: 'section',
												id: row.section._id,
												index: sectionIndex,
												text: row.section.name,
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

								{open ? (
									<View className="gap-2 border-border border-t p-3.5">
										{row.items.length === 0 ? (
											<Text className="font-sans text-muted-foreground text-xs">
												No clauses in this section yet.
											</Text>
										) : (
											row.items.map((clause, clauseIndex) => (
												<View
													className="flex-row items-start gap-2"
													key={clause._id}
												>
													<Text className="font-sans text-muted-foreground text-xs tabular-nums">
														{sectionIndex + 1}.{clauseIndex + 1}
													</Text>
													<Text className="flex-1 font-sans text-foreground text-sm">
														{clause.text}
													</Text>
													<Pressable
														accessibilityLabel="Clause actions"
														accessibilityRole="button"
														hitSlop={8}
														onPress={() => {
															setTarget({
																kind: 'clause',
																id: clause._id,
																index: clauseIndex,
																sectionId: row.section._id,
																siblings,
																text: clause.text,
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
							</Card>
						</Animated.View>
					);
				}}
			/>

			<ActionSheet items={menuItems} ref={menuRef} title={target?.text} />
			<QuoteEntrySheet
				label="Section name"
				onSubmit={(text, sectionId) =>
					sectionId
						? updateSection({
								sectionId: sectionId as TermSectionId,
								name: text,
							})
						: addSection({ templateId: id, name: text })
				}
				placeholder="e.g. Payment"
				ref={sectionSheetRef}
				title="Add section"
			/>
			<QuoteEntrySheet
				label="Clause"
				multiline
				onSubmit={(text, itemId) => {
					if (itemId) {
						return updateItem({ itemId: itemId as TermItemId, text });
					}
					if (!addingTo) {
						return Promise.resolve();
					}
					return addItem({ sectionId: addingTo, text });
				}}
				placeholder="Write the clause…"
				ref={clauseSheetRef}
				title="Add clause"
			/>
		</View>
	);
}
