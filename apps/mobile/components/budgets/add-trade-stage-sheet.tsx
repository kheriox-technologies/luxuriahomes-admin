import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import {
	MultiSelect,
	type MultiSelectOption,
} from '@/components/ui/multi-select';

export interface AddTradeStageSheetHandle {
	present: () => void;
}

export function AddTradeStageSheet({
	ref,
}: {
	ref?: Ref<AddTradeStageSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const trades = useQuery(api.trades.list.list, {}) as
		| Doc<'trades'>[]
		| undefined;
	const addStage = useMutation(api.tradeStages.add.add);

	const [name, setName] = useState('');
	const [tradeIds, setTradeIds] = useState<Id<'trades'>[]>([]);
	const [saving, setSaving] = useState(false);

	// Only ungrouped trades can be pulled into a brand-new stage.
	const ungroupedOptions = useMemo<MultiSelectOption<Id<'trades'>>[]>(
		() =>
			(trades ?? [])
				.filter((trade) => !trade.stageId)
				.sort((a, b) =>
					a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
				)
				.map((trade) => ({ value: trade._id, label: trade.name })),
		[trades]
	);

	useImperativeHandle(ref, () => ({
		present: () => {
			setName('');
			setTradeIds([]);
			sheetRef.current?.present();
		},
	}));

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

	const toggleTrade = (tradeId: Id<'trades'>) =>
		setTradeIds((prev) =>
			prev.includes(tradeId)
				? prev.filter((id) => id !== tradeId)
				: [...prev, tradeId]
		);

	const handleSave = async () => {
		const trimmed = name.trim();
		if (!trimmed) {
			Alert.alert('Enter a stage name');
			return;
		}
		setSaving(true);
		try {
			await addStage({
				name: trimmed,
				tradeIds: tradeIds.length > 0 ? tradeIds : undefined,
			});
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not add stage', 'Please try again.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={520}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-4 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="font-sans-semibold text-base text-foreground">
					Add stage
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">Name</Text>
					<BottomSheetTextInput
						className="h-9 rounded-lg border border-border bg-card px-3 font-sans text-foreground text-sm"
						onChangeText={setName}
						placeholder="e.g. Fit-out"
						placeholderTextColor={colors.mutedForeground}
						value={name}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Trades (optional)
					</Text>
					<MultiSelect
						onToggle={toggleTrade}
						options={ungroupedOptions}
						placeholder="Add ungrouped trades"
						title="Add trades to this stage"
						values={tradeIds}
					/>
				</View>

				<Button disabled={saving} loading={saving} onPress={handleSave}>
					Add stage
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
