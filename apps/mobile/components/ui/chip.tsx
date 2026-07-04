import { Pressable, ScrollView, Text } from 'react-native';
import { cn } from '@/lib/cn';

export function Chip({
	label,
	selected,
	onPress,
	className,
}: {
	label: string;
	selected: boolean;
	onPress: () => void;
	className?: string;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected }}
			className={cn(
				'min-h-[36px] items-center justify-center rounded-lg border px-4 py-1.5',
				selected ? 'border-primary bg-primary' : 'border-border bg-card',
				className
			)}
			hitSlop={4}
			onPress={onPress}
		>
			<Text
				className={cn(
					'font-sans-medium text-sm',
					selected ? 'text-primary-foreground' : 'text-foreground'
				)}
			>
				{label}
			</Text>
		</Pressable>
	);
}

export function ChipBar<T extends string>({
	options,
	selected,
	onSelect,
	labels,
	className,
}: {
	options: readonly T[];
	selected: T;
	onSelect: (value: T) => void;
	labels?: Partial<Record<T, string>>;
	className?: string;
}) {
	return (
		<ScrollView
			className={className}
			contentContainerClassName="gap-2 px-4"
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			{options.map((option) => (
				<Chip
					key={option}
					label={labels?.[option] ?? option}
					onPress={() => onSelect(option)}
					selected={selected === option}
				/>
			))}
		</ScrollView>
	);
}
