import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
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
import { Button } from '@/components/ui/button';
import type { ProjectInclusion } from './types';

const VARIATION_PATTERN = /^-?\d+(\.\d{1,2})?$/;

export interface InclusionAdjustVariationSheetHandle {
	present: (inclusion: ProjectInclusion) => void;
}

export function InclusionAdjustVariationSheet({
	ref,
}: {
	ref?: Ref<InclusionAdjustVariationSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [inclusion, setInclusion] = useState<ProjectInclusion | null>(null);
	const [value, setValue] = useState('');
	const [saving, setSaving] = useState(false);

	const update = useMutation(api.projectInclusions.update.update);

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setInclusion(next);
			setValue(
				next.variationPrice === undefined ? '' : String(next.variationPrice)
			);
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

	const trimmed = value.trim();
	const isValid = trimmed === '' || VARIATION_PATTERN.test(trimmed);

	const handleSave = async () => {
		if (!(inclusion && isValid)) {
			return;
		}
		setSaving(true);
		try {
			await update({
				projectInclusionId: inclusion._id,
				variationPrice: trimmed === '' ? null : Number(trimmed),
			});
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Unable to update variation', 'Please try again.');
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
			ref={sheetRef}
		>
			<BottomSheetView
				className="gap-4 px-4 pt-1"
				style={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text
					className="font-sans-semibold text-base text-foreground"
					numberOfLines={1}
				>
					Adjust variation{inclusion ? ` · ${inclusion.code}` : ''}
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Variation (total)
					</Text>
					<View className="flex-row items-center gap-2 rounded-lg border border-border bg-background px-3">
						<Text className="font-sans text-base text-muted-foreground">$</Text>
						<BottomSheetTextInput
							className="h-11 flex-1 font-sans text-base text-foreground"
							keyboardType="numbers-and-punctuation"
							onChangeText={setValue}
							placeholder="0.00"
							placeholderTextColor={colors.mutedForeground}
							value={value}
						/>
						<Text className="font-sans text-muted-foreground text-sm">AUD</Text>
					</View>
					<Text className="font-sans text-muted-foreground text-xs">
						Combined base and labour variation. Leave blank to clear.
					</Text>
					{isValid ? null : (
						<Text className="font-sans text-destructive text-xs">
							Enter a number with up to two decimals.
						</Text>
					)}
				</View>

				<Button
					disabled={saving || !isValid}
					loading={saving}
					onPress={handleSave}
				>
					Save
				</Button>
			</BottomSheetView>
		</BottomSheetModal>
	);
}
