import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { cn } from '@/lib/cn';
import { ActionSheet } from './action-sheet';

export interface SelectOption<T extends string> {
	label: string;
	value: T;
}

/**
 * A pill-styled dropdown trigger that opens an ActionSheet of options. Mirrors
 * the schedule toolbar pill styling so it sits naturally in a toolbar row.
 */
export function Select<T extends string>({
	value,
	options,
	onChange,
	title,
	placeholder = 'Select',
	className,
	disabled,
}: {
	value: T;
	options: readonly SelectOption<T>[];
	onChange: (value: T) => void;
	title?: string;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);
	const selectedOption = options.find((option) => option.value === value);
	const selectedLabel = selectedOption?.label ?? placeholder;

	return (
		<>
			<Pressable
				accessibilityRole="button"
				accessibilityState={{ disabled: disabled === true, expanded: false }}
				className={cn(
					'h-9 flex-row items-center justify-between gap-1.5 rounded-lg border border-border bg-card px-3 active:bg-muted',
					disabled && 'opacity-60',
					className
				)}
				disabled={disabled}
				hitSlop={4}
				onPress={() => sheetRef.current?.present()}
			>
				<Text
					className={cn(
						'flex-1 font-sans text-xs',
						selectedOption ? 'text-foreground' : 'text-muted-foreground'
					)}
					numberOfLines={1}
				>
					{selectedLabel}
				</Text>
				<View className="shrink-0">
					<ChevronDown
						color={colors.mutedForeground}
						size={16}
						strokeWidth={2}
					/>
				</View>
			</Pressable>
			<ActionSheet
				items={options.map((option) => ({
					key: option.value,
					label: option.label,
					selected: option.value === value,
					icon: option.value === value ? Check : undefined,
					onPress: () => {
						onChange(option.value);
						sheetRef.current?.dismiss();
					},
				}))}
				ref={sheetRef}
				title={title}
			/>
		</>
	);
}
