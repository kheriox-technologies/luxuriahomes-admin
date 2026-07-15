import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
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

interface InputSheetConfig {
	confirmLabel: string;
	initialValue?: string;
	onConfirm: (value: string) => Promise<unknown> | undefined;
	placeholder?: string;
	title: string;
}

export interface InputSheetHandle {
	present: (config: InputSheetConfig) => void;
}

export function InputSheet({ ref }: { ref?: Ref<InputSheetHandle> }) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [config, setConfig] = useState<InputSheetConfig | null>(null);
	const [value, setValue] = useState('');
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setConfig(next);
			setValue(next.initialValue ?? '');
			setSaving(false);
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

	const handleConfirm = async () => {
		const trimmed = value.trim();
		if (!config || trimmed === '') {
			return;
		}
		setSaving(true);
		try {
			await config.onConfirm(trimmed);
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Something went wrong', 'Please try again.');
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
				<Text className="font-sans-semibold text-base text-foreground">
					{config?.title}
				</Text>
				<BottomSheetTextInput
					autoFocus
					className="min-h-[48px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
					onChangeText={setValue}
					onSubmitEditing={handleConfirm}
					placeholder={config?.placeholder ?? 'Name'}
					placeholderTextColor={colors.mutedForeground}
					returnKeyType="done"
					value={value}
				/>
				<View className="flex-row items-center gap-2">
					<Button
						className="flex-1"
						onPress={() => sheetRef.current?.dismiss()}
					>
						Cancel
					</Button>
					<Button
						className="flex-1"
						disabled={value.trim() === ''}
						loading={saving}
						onPress={handleConfirm}
					>
						{config?.confirmLabel ?? 'Save'}
					</Button>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
}
