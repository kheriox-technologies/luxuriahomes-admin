import DateTimePicker, {
	type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { CalendarDays, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';

/**
 * Pill-styled date picker. On Android it opens the native dialog directly; on
 * iOS it shows an inline calendar inside a modal with a Done button. Clearable.
 */
export function DateField({
	label,
	value,
	onChange,
	placeholder = 'Select date',
	className,
}: {
	label: string;
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
}) {
	const colors = useThemeColors();
	const [open, setOpen] = useState(false);

	const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
		setOpen(false);
		if (event.type === 'set' && date) {
			onChange(date);
		}
	};

	const handleIosChange = (_event: DateTimePickerEvent, date?: Date) => {
		if (date) {
			onChange(date);
		}
	};

	return (
		<View className={cn('gap-1.5', className)}>
			<Text className="font-sans-medium text-foreground text-sm">{label}</Text>
			<View className="flex-row items-center gap-2">
				<Pressable
					accessibilityRole="button"
					className="h-9 flex-1 flex-row items-center gap-2 rounded-lg border border-border bg-card px-3"
					onPress={() => setOpen(true)}
				>
					<CalendarDays
						color={colors.mutedForeground}
						size={16}
						strokeWidth={2}
					/>
					<Text
						className={cn(
							'font-sans text-sm',
							value ? 'text-foreground' : 'text-muted-foreground'
						)}
					>
						{value ? formatDate(value.getTime()) : placeholder}
					</Text>
				</Pressable>
				{value ? (
					<Pressable
						accessibilityLabel="Clear date"
						accessibilityRole="button"
						className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
						hitSlop={4}
						onPress={() => onChange(undefined)}
					>
						<X color={colors.mutedForeground} size={18} strokeWidth={2} />
					</Pressable>
				) : null}
			</View>

			{open && Platform.OS === 'android' ? (
				<DateTimePicker
					display="default"
					mode="date"
					onChange={handleAndroidChange}
					value={value ?? new Date()}
				/>
			) : null}

			{Platform.OS === 'ios' ? (
				<Modal animationType="slide" transparent visible={open}>
					<Pressable
						className="flex-1 justify-end bg-black/50"
						onPress={() => setOpen(false)}
					>
						<Pressable className="gap-2 rounded-t-2xl bg-card p-4">
							<View className="flex-row items-center justify-between">
								<Text className="font-sans-semibold text-base text-foreground">
									{label}
								</Text>
								<Pressable
									accessibilityRole="button"
									hitSlop={8}
									onPress={() => setOpen(false)}
								>
									<Text className="font-sans-semibold text-base text-info">
										Done
									</Text>
								</Pressable>
							</View>
							<DateTimePicker
								display="inline"
								mode="date"
								onChange={handleIosChange}
								value={value ?? new Date()}
							/>
						</Pressable>
					</Pressable>
				</Modal>
			) : null}
		</View>
	);
}
