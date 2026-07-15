import type { TextInputProps } from 'react-native';
import { Text, View } from 'react-native';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import { cn } from '@/lib/cn';
import { CONTROL_HEIGHT } from '@/lib/theme';

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
}) {
	return (
		<View className={cn('gap-1.5', className)}>
			<Text className="font-sans-medium text-foreground text-sm">{label}</Text>
			<View
				className={cn(
					'rounded-lg border bg-card px-3',
					error ? 'border-destructive' : 'border-border'
				)}
				style={{ height: CONTROL_HEIGHT }}
			>
				<CenteredTextInput
					autoCapitalize={autoCapitalize}
					autoComplete={autoComplete}
					keyboardType={keyboardType}
					onChangeText={onChangeText}
					placeholder={placeholder}
					value={value}
				/>
			</View>
			{error ? (
				<Text className="font-sans text-destructive text-xs">{error}</Text>
			) : null}
		</View>
	);
}
