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
import { Select, type SelectOption } from '@/components/ui/select';

const UNGROUPED_VALUE = '';

export interface EditTradePayload {
	description: string | null;
	name: string;
	stageId: Id<'tradeStages'> | null;
	tradeId: Id<'trades'>;
}

export interface EditTradeSheetHandle {
	present: (trade: EditTradePayload) => void;
}

export function EditTradeSheet({ ref }: { ref?: Ref<EditTradeSheetHandle> }) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const stages = useQuery(api.tradeStages.list.list, {}) as
		| Doc<'tradeStages'>[]
		| undefined;
	const updateTrade = useMutation(api.trades.update.update);

	const [tradeId, setTradeId] = useState<Id<'trades'> | ''>('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [stageValue, setStageValue] = useState<string>(UNGROUPED_VALUE);
	const [saving, setSaving] = useState(false);

	const stageOptions = useMemo<SelectOption<string>[]>(
		() => [
			{ value: UNGROUPED_VALUE, label: 'Ungrouped' },
			...(stages ?? []).map((stage) => ({
				value: stage._id as string,
				label: stage.name,
			})),
		],
		[stages]
	);

	useImperativeHandle(ref, () => ({
		present: (trade) => {
			setTradeId(trade.tradeId);
			setName(trade.name);
			setDescription(trade.description ?? '');
			setStageValue(trade.stageId ?? UNGROUPED_VALUE);
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
		const trimmed = name.trim();
		if (!trimmed) {
			Alert.alert('Enter a trade name');
			return;
		}
		if (!tradeId) {
			return;
		}
		setSaving(true);
		try {
			await updateTrade({
				tradeId,
				name: trimmed,
				description: description.trim() || undefined,
				stageId:
					stageValue === UNGROUPED_VALUE
						? null
						: (stageValue as Id<'tradeStages'>),
			});
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not update trade', 'Please try again.');
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
					Edit trade
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">Name</Text>
					<BottomSheetTextInput
						className="h-9 rounded-lg border border-border bg-card px-3 font-sans text-foreground text-sm"
						onChangeText={setName}
						placeholder="Trade name"
						placeholderTextColor={colors.mutedForeground}
						value={name}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Stage
					</Text>
					<Select
						onChange={setStageValue}
						options={stageOptions}
						placeholder="Ungrouped"
						title="Select stage"
						value={stageValue}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Description
					</Text>
					<BottomSheetTextInput
						className="min-h-[72px] rounded-lg border border-border bg-card px-3 py-2 font-sans text-foreground text-sm"
						multiline
						onChangeText={setDescription}
						placeholder="Optional"
						placeholderTextColor={colors.mutedForeground}
						textAlignVertical="top"
						value={description}
					/>
				</View>

				<Button disabled={saving} loading={saving} onPress={handleSave}>
					Save
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
