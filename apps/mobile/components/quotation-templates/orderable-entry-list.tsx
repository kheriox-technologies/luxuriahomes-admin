import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { LucideIcon } from 'lucide-react-native';
import {
	ArrowDown,
	ArrowUp,
	MoreVertical,
	Plus,
	SquarePen,
	Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { convexErrorMessage } from '@/lib/project-form';
import {
	QuoteEntrySheet,
	type QuoteEntrySheetHandle,
} from './quote-entry-sheet';

export interface OrderableEntry {
	_id: string;
	text: string;
}

/**
 * A flat, reorderable list of text rows — the shape the exclusions and notes
 * tabs both take.
 *
 * The portal reorders these by dragging. There is no drag-and-drop library in
 * this app and pulling one in for two lists would be out of proportion, so the
 * row menu carries Move up / Move down and submits the same `reorder` mutation
 * with the ids in their new order.
 *
 * Presentational only: the caller owns the Convex hooks, because a union of
 * function references defeats Convex's argument and return-type inference.
 */
export function OrderableEntryList({
	emptyDescription,
	emptyTitle,
	entries,
	icon,
	noun,
	onAdd,
	onRemove,
	onReorder,
	onUpdate,
}: {
	emptyDescription: string;
	emptyTitle: string;
	entries: OrderableEntry[] | undefined;
	icon: LucideIcon;
	noun: string;
	onAdd: (text: string) => Promise<unknown>;
	onRemove: (id: string) => Promise<unknown>;
	onReorder: (orderedIds: string[]) => Promise<unknown>;
	onUpdate: (id: string, text: string) => Promise<unknown>;
}) {
	const colors = useThemeColors();
	const [selected, setSelected] = useState<OrderableEntry | null>(null);
	const sheetRef = useRef<QuoteEntrySheetHandle>(null);
	const menuRef = useRef<BottomSheetModal>(null);

	const rows = entries ?? [];
	const selectedIndex = selected
		? rows.findIndex((row) => row._id === selected._id)
		: -1;

	const move = (delta: number) => {
		if (selectedIndex < 0) {
			return;
		}
		const target = selectedIndex + delta;
		if (target < 0 || target >= rows.length) {
			return;
		}
		const ordered = rows.map((row) => row._id);
		const [moved] = ordered.splice(selectedIndex, 1);
		ordered.splice(target, 0, moved as string);
		onReorder(ordered).catch((error) =>
			Alert.alert(
				'Could not reorder',
				convexErrorMessage(error, 'Please try again.')
			)
		);
	};

	const confirmDelete = (entry: OrderableEntry) => {
		Alert.alert(`Delete ${noun}?`, entry.text, [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					onRemove(entry._id).catch((error) =>
						Alert.alert(
							`Could not delete ${noun}`,
							convexErrorMessage(error, 'Please try again.')
						)
					);
				},
			},
		]);
	};

	const menuItems: ActionSheetItem[] = selected
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: SquarePen,
					onPress: () => sheetRef.current?.present(selected.text, selected._id),
				},
				{
					key: 'up',
					label: 'Move up',
					icon: ArrowUp,
					disabled: selectedIndex <= 0,
					onPress: () => move(-1),
				},
				{
					key: 'down',
					label: 'Move down',
					icon: ArrowDown,
					disabled: selectedIndex < 0 || selectedIndex >= rows.length - 1,
					onPress: () => move(1),
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: () => confirmDelete(selected),
				},
			]
		: [];

	return (
		<View className="flex-1">
			<View className="flex-row items-center justify-end px-4 pb-3">
				<Pressable
					accessibilityLabel={`Add ${noun}`}
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => sheetRef.current?.present()}
				>
					<Plus color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
			</View>

			{entries === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={rows}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description={emptyDescription}
							icon={icon}
							title={emptyTitle}
						/>
					}
					renderItem={({ item, index }) => (
						<Card className="mx-4 mb-2 flex-row items-center gap-3 p-3.5">
							<Text className="font-sans text-muted-foreground text-xs tabular-nums">
								{index + 1}
							</Text>
							<Text className="flex-1 font-sans text-foreground text-sm">
								{item.text}
							</Text>
							<Pressable
								accessibilityLabel={`Actions for ${item.text}`}
								accessibilityRole="button"
								hitSlop={8}
								onPress={() => {
									setSelected(item);
									menuRef.current?.present();
								}}
							>
								<MoreVertical
									color={colors.mutedForeground}
									size={18}
									strokeWidth={2}
								/>
							</Pressable>
						</Card>
					)}
				/>
			)}

			<ActionSheet items={menuItems} ref={menuRef} title={selected?.text} />
			<QuoteEntrySheet
				label={noun}
				multiline
				onSubmit={(text, id) => (id ? onUpdate(id, text) : onAdd(text))}
				placeholder={`Add ${noun === 'exclusion' ? 'an' : 'a'} ${noun}…`}
				ref={sheetRef}
				title={`Add ${noun}`}
			/>
		</View>
	);
}
