import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import {
	Platform,
	Text,
	TextInput,
	type TextInputProps,
	View,
} from 'react-native';
import { useThemeColors } from '@/components/theme';
import { useIsInBottomSheet } from '@/components/ui/bottom-sheet-input-context';
import { cn } from '@/lib/cn';

const androidText =
	Platform.OS === 'android' ? { includeFontPadding: false } : {};

/**
 * Shared text input that reliably vertical-centers its placeholder and text.
 *
 * The native iOS placeholder ignores a custom font's metrics and sits high, so
 * we render our own placeholder (a centered <Text> overlay shown only when the
 * field is empty). The TextInput has no height and collapses to its line; the
 * flex-1 + justify-center container centers both it and the overlay identically.
 * Font size is fixed at 14 so every input (form fields, search) matches.
 */
export function CenteredTextInput({
	value,
	onChangeText,
	placeholder,
	containerClassName,
	...inputProps
}: {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	containerClassName?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'style'>) {
	const colors = useThemeColors();
	// Inside a bottom sheet, use gorhom's BottomSheetTextInput so the sheet's
	// interactive keyboard behavior tracks focus and lifts to the field.
	const Input = useIsInBottomSheet() ? BottomSheetTextInput : TextInput;
	return (
		<View className={cn('flex-1 justify-center', containerClassName)}>
			<Input
				className="font-sans"
				onChangeText={onChangeText}
				placeholder=""
				style={{
					padding: 0,
					margin: 0,
					fontSize: 14,
					color: colors.foreground,
					...androidText,
				}}
				value={value}
				{...inputProps}
			/>
			{value.length === 0 && placeholder ? (
				<View
					className="justify-center"
					pointerEvents="none"
					style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
				>
					<Text
						className="font-sans"
						numberOfLines={1}
						style={{
							fontSize: 14,
							color: colors.mutedForeground,
							...androidText,
						}}
					>
						{placeholder}
					</Text>
				</View>
			) : null}
		</View>
	);
}
