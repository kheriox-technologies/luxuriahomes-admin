import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { cn } from '@/lib/cn';
import { ActionSheet, type ActionSheetItem } from './action-sheet';

export interface MultiSelectOption<T extends string> {
	label: string;
	value: T;
}

const CHIP_GAP = 4; // gap-1

function Chip({
	label,
	measure,
	onMeasure,
}: {
	label: string;
	measure?: boolean;
	onMeasure?: (width: number) => void;
}) {
	return (
		<View
			className="h-6 shrink-0 flex-row items-center rounded-md bg-muted px-2"
			onLayout={
				measure
					? (event: LayoutChangeEvent) =>
							onMeasure?.(event.nativeEvent.layout.width)
					: undefined
			}
		>
			<Text
				className="max-w-[140px] font-sans-medium text-foreground text-xs"
				numberOfLines={1}
			>
				{label}
			</Text>
		</View>
	);
}

/**
 * A pill-styled multi-select trigger that shows selected options as chips with a
 * "+N more" overflow badge, and opens an ActionSheet of toggleable options.
 * Mobile analog of the portal's TaskMultiSelectFilter.
 */
export function MultiSelect<T extends string>({
	values,
	options,
	onToggle,
	title,
	placeholder = 'Select',
	maxSelected,
	className,
}: {
	values: T[];
	options: readonly MultiSelectOption<T>[];
	onToggle: (value: T) => void;
	title?: string;
	placeholder?: string;
	maxSelected?: number;
	className?: string;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);

	const labelByValue = useMemo(() => {
		const map = new Map<T, string>();
		for (const option of options) {
			map.set(option.value, option.label);
		}
		return map;
	}, [options]);

	const chipWidths = useRef(new Map<T, number>());
	const moreWidth = useRef(0);
	const [containerWidth, setContainerWidth] = useState(0);
	const [measureTick, setMeasureTick] = useState(0);
	const [visibleCount, setVisibleCount] = useState(values.length);

	const chipsKey = values.map((v) => labelByValue.get(v) ?? v).join('|');

	// Measure chips against the available width and collapse the overflow into a
	// "+N more" badge so chips always stay on a single line.
	// biome-ignore lint/correctness/useExhaustiveDependencies: chipsKey and measureTick are intentional recompute triggers; chip widths are read from refs
	useEffect(() => {
		if (values.length === 0 || containerWidth === 0) {
			setVisibleCount(values.length);
			return;
		}

		const widths = values.map((v) => chipWidths.current.get(v) ?? 0);
		if (widths.some((width) => width === 0)) {
			// Wait until every chip has reported its width.
			return;
		}

		let total = 0;
		for (const [index, width] of widths.entries()) {
			total += width + (index > 0 ? CHIP_GAP : 0);
		}
		if (total <= containerWidth) {
			setVisibleCount(widths.length);
			return;
		}

		// Fit as many chips as possible while reserving room for the badge.
		let used = 0;
		let count = 0;
		for (const width of widths) {
			const chipWidth = width + (count > 0 ? CHIP_GAP : 0);
			if (used + chipWidth + CHIP_GAP + moreWidth.current <= containerWidth) {
				used += chipWidth;
				count++;
			} else {
				break;
			}
		}
		setVisibleCount(count);
	}, [chipsKey, containerWidth, measureTick]);

	const hiddenCount = Math.max(values.length - visibleCount, 0);
	const limitReached =
		maxSelected !== undefined && values.length >= maxSelected;

	const items: ActionSheetItem[] = options.map((option) => {
		const selected = values.includes(option.value);
		return {
			key: option.value,
			label: option.label,
			selected,
			icon: selected ? Check : undefined,
			onPress: () => onToggle(option.value),
		};
	});

	return (
		<>
			<Pressable
				accessibilityRole="button"
				accessibilityState={{ expanded: false }}
				className={cn(
					'h-9 flex-row items-center gap-1.5 rounded-lg border border-border bg-card px-3 active:bg-muted',
					className
				)}
				hitSlop={4}
				onPress={() => sheetRef.current?.present()}
			>
				<View
					className="flex-1 flex-row items-center gap-1 overflow-hidden"
					onLayout={(event) =>
						setContainerWidth(event.nativeEvent.layout.width)
					}
				>
					{values.length === 0 ? (
						<Text
							className="font-sans-medium text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{placeholder}
						</Text>
					) : (
						<>
							{values.slice(0, visibleCount).map((value) => (
								<Chip key={value} label={labelByValue.get(value) ?? value} />
							))}
							{hiddenCount > 0 ? (
								<View className="h-6 shrink-0 flex-row items-center rounded-md bg-muted px-2">
									<Text className="font-sans-medium text-muted-foreground text-xs">
										+{hiddenCount} more
									</Text>
								</View>
							) : null}
						</>
					)}
				</View>
				<ChevronDown color={colors.mutedForeground} size={16} strokeWidth={2} />

				{/* Hidden measurement row: renders every chip so widths can be measured. */}
				<View
					aria-hidden
					className="absolute flex-row items-center gap-1 opacity-0"
					pointerEvents="none"
				>
					{values.map((value) => (
						<Chip
							key={value}
							label={labelByValue.get(value) ?? value}
							measure
							onMeasure={(width) => {
								chipWidths.current.set(value, width);
								// Nudge a recompute once each chip reports its width.
								setMeasureTick((tick) => tick + 1);
							}}
						/>
					))}
					<View
						className="h-6 flex-row items-center rounded-md bg-muted px-2"
						onLayout={(event) => {
							moreWidth.current = event.nativeEvent.layout.width;
						}}
					>
						<Text className="font-sans-medium text-muted-foreground text-xs">
							+{values.length} more
						</Text>
					</View>
				</View>
			</Pressable>
			<ActionSheet
				items={
					limitReached
						? items.map((item) =>
								item.selected ? item : { ...item, onPress: () => undefined }
							)
						: items
				}
				ref={sheetRef}
				title={title}
			/>
		</>
	);
}
