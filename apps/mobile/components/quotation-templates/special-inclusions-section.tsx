import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Plus,
	SquarePen,
	Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { convexErrorMessage } from '@/lib/project-form';
import {
	SpecialInclusionSheet,
	type SpecialInclusionSheetHandle,
} from './special-inclusion-sheet';

type SpecialInclusion = Doc<'quotationSpecialInclusions'>;

/**
 * The standard extras quoted across every kind of build.
 *
 * Deliberately global rather than per template — the same handful of upgrades
 * come up whatever the house is — which is why this hangs off the templates
 * list rather than living inside one. A quotation copies the rows it picks by
 * value, so editing this list never reaches a quotation already issued.
 *
 * Collapsed by default: it is reference data below the list, not the reason
 * anyone opened the screen.
 */
export function SpecialInclusionsSection() {
	const colors = useThemeColors();
	const inclusions = useQuery(api.quotationSpecialInclusions.list.list, {});
	const removeInclusion = useMutation(
		api.quotationSpecialInclusions.remove.remove
	);

	const [expanded, setExpanded] = useState(false);
	const [selected, setSelected] = useState<SpecialInclusion | null>(null);
	const sheetRef = useRef<SpecialInclusionSheetHandle>(null);
	const menuRef = useRef<BottomSheetModal>(null);

	const handleDelete = (inclusion: SpecialInclusion) => {
		Alert.alert(
			'Delete inclusion?',
			`This removes "${inclusion.text}" from the standard list. Quotations that already carry it are unaffected.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeInclusion({ inclusionId: inclusion._id }).catch((error) =>
							Alert.alert(
								'Could not delete inclusion',
								convexErrorMessage(error, 'Please try again.')
							)
						);
					},
				},
			]
		);
	};

	const menuItems: ActionSheetItem[] = selected
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: SquarePen,
					onPress: () =>
						sheetRef.current?.present({
							inclusionId: selected._id,
							text: selected.text,
							amount: selected.amount ?? null,
						}),
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: () => handleDelete(selected),
				},
			]
		: [];

	const count = inclusions?.length ?? 0;

	return (
		<Animated.View className="mt-2" layout={LinearTransition}>
			<View className="flex-row items-center gap-2 px-4 pt-5 pb-2">
				<Pressable
					accessibilityLabel={
						expanded
							? 'Collapse special inclusions'
							: 'Expand special inclusions'
					}
					accessibilityRole="button"
					className="flex-1 flex-row items-center gap-2"
					hitSlop={8}
					onPress={() => setExpanded((current) => !current)}
				>
					{expanded ? (
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
					<Text className="font-sans-semibold text-muted-foreground text-xs uppercase tracking-wider">
						Standard special inclusions
					</Text>
					{count > 0 ? <Badge variant="outline">{String(count)}</Badge> : null}
				</Pressable>
				<Pressable
					accessibilityLabel="Add special inclusion"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => sheetRef.current?.present()}
				>
					<Plus color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
			</View>

			{expanded ? (
				<View className="gap-2 px-4">
					{count === 0 ? (
						<Text className="font-sans text-muted-foreground text-xs">
							{inclusions === undefined
								? 'Loading…'
								: 'Nothing standard yet. Anything added here can be pulled into a quotation with one tap.'}
						</Text>
					) : (
						inclusions?.map((inclusion) => (
							<Card
								className="flex-row items-center gap-3 p-3.5"
								key={inclusion._id}
							>
								<Text
									className="flex-1 font-sans text-foreground text-sm"
									numberOfLines={2}
								>
									{inclusion.text}
								</Text>
								{inclusion.amount === undefined ? null : (
									<Badge variant="purple">
										{formatCurrency(inclusion.amount)}
									</Badge>
								)}
								<Pressable
									accessibilityLabel={`Actions for ${inclusion.text}`}
									accessibilityRole="button"
									hitSlop={8}
									onPress={() => {
										setSelected(inclusion);
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
						))
					)}
				</View>
			) : null}

			<ActionSheet items={menuItems} ref={menuRef} title={selected?.text} />
			<SpecialInclusionSheet ref={sheetRef} />
		</Animated.View>
	);
}
