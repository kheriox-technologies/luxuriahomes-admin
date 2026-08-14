import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { TradeSelectField } from '@/components/trades/trade-select-field';
import { Button } from '@/components/ui/button';
import {
	isValidMoneyString,
	isValidPercentString,
	parseMoneyString,
	parsePercentString,
} from './budget-form-shared';

export interface AddTemplateItemSheetHandle {
	present: () => void;
}

export function AddTemplateItemSheet({
	budgetTemplateId,
	excludedTradeIds,
	ref,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
	// Trades already in this template — excluded from the picker.
	excludedTradeIds: Id<'trades'>[];
	ref?: Ref<AddTemplateItemSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addItem = useMutation(api.budgetTemplateItems.addItem.addItem);

	const [tradeId, setTradeId] = useState<Id<'trades'> | ''>('');
	const [price, setPrice] = useState('');
	const [contingency, setContingency] = useState('0');
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: () => {
			setTradeId('');
			setPrice('');
			setContingency('0');
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

	const handleSave = async () => {
		const trimmedPrice = price.trim();
		if (!isValidMoneyString(trimmedPrice)) {
			Alert.alert('Enter a valid price');
			return;
		}
		const trimmedContingency = contingency.trim();
		if (
			trimmedContingency !== '' &&
			!isValidPercentString(trimmedContingency)
		) {
			Alert.alert('Enter a contingency between 0 and 100');
			return;
		}
		if (!tradeId) {
			Alert.alert('Select a trade');
			return;
		}
		setSaving(true);
		try {
			await addItem({
				budgetTemplateId,
				tradeId,
				price: parseMoneyString(trimmedPrice),
				contingencyPercent:
					trimmedContingency === ''
						? 0
						: parsePercentString(trimmedContingency),
			});
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not add trade', 'Please try again.');
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
			maxDynamicContentSize={420}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-4 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="font-sans-semibold text-base text-foreground">
					Add trade
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Trade
					</Text>
					<TradeSelectField
						allowCreate
						excludeTradeIds={excludedTradeIds}
						onValueChange={setTradeId}
						value={tradeId}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Price
					</Text>
					<View className="h-9 flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
						<Text className="font-sans text-muted-foreground text-sm">$</Text>
						<BottomSheetTextInput
							className="flex-1 font-sans text-foreground text-sm"
							keyboardType="decimal-pad"
							onChangeText={setPrice}
							placeholder="0.00"
							placeholderTextColor={colors.mutedForeground}
							value={price}
						/>
						<Text className="font-sans text-muted-foreground text-sm">AUD</Text>
					</View>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Contingency
					</Text>
					<View className="h-9 flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
						<BottomSheetTextInput
							className="flex-1 font-sans text-foreground text-sm"
							keyboardType="decimal-pad"
							onChangeText={setContingency}
							placeholder="0"
							placeholderTextColor={colors.mutedForeground}
							value={contingency}
						/>
						<Text className="font-sans text-muted-foreground text-sm">%</Text>
					</View>
				</View>

				<Button disabled={saving} loading={saving} onPress={handleSave}>
					Add trade
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
