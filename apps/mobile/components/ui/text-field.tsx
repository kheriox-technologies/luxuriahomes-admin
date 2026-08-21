import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { useIsInBottomSheet } from '@/components/ui/bottom-sheet-input-context';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import { cn } from '@/lib/cn';
import { CONTROL_HEIGHT } from '@/lib/theme';

const MULTILINE_MIN_HEIGHT = 88;

export function TextField({
	label,
	value,
	onChangeText,
	placeholder,
	error,
	keyboardType,
	autoCapitalize,
	autoComplete,
	className,
	multiline = false,
}: {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	error?: string;
	keyboardType?: TextInputProps['keyboardType'];
	autoCapitalize?: TextInputProps['autoCapitalize'];
	autoComplete?: TextInputProps['autoComplete'];
	className?: string;
	multiline?: boolean;
}) {
	const colors = useThemeColors();
	// `CenteredTextInput` centres a single line against a fixed control height,
	// which is exactly wrong for a growing box — so a multiline field renders the
	// sheet-aware input directly and pins its text to the top instead.
	const MultilineInput = useIsInBottomSheet()
		? BottomSheetTextInput
		: TextInput;

	return (
		<View className={cn('gap-1.5', className)}>
			<Text className="font-sans-medium text-foreground text-sm">{label}</Text>
			<View
				className={cn(
					'rounded-lg border bg-card px-3',
					multiline && 'py-2',
					error ? 'border-destructive' : 'border-border'
				)}
				style={multiline ? undefined : { height: CONTROL_HEIGHT }}
			>
				{multiline ? (
					<MultilineInput
						multiline
						onChangeText={onChangeText}
						placeholder={placeholder}
						placeholderTextColor={colors.mutedForeground}
						style={{
							minHeight: MULTILINE_MIN_HEIGHT,
							padding: 0,
							margin: 0,
							fontSize: 14,
							color: colors.foreground,
						}}
						textAlignVertical="top"
						value={value}
					/>
				) : (
					<CenteredTextInput
						autoCapitalize={autoCapitalize}
						autoComplete={autoComplete}
						keyboardType={keyboardType}
						onChangeText={onChangeText}
						placeholder={placeholder}
						value={value}
					/>
				)}
			</View>
			{error ? (
				<Text className="font-sans text-destructive text-xs">{error}</Text>
			) : null}
		</View>
	);
}
