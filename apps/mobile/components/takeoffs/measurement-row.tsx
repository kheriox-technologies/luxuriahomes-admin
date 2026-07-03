import {
	Circle,
	Hash,
	Minus,
	RectangleHorizontal,
	Ruler,
	Waypoints,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import {
	FALLBACK_COLOR,
	type Measurement,
	measurementValueText,
} from '@/lib/takeoffs/math';

const TYPE_ICONS = {
	linear: Ruler,
	rectangle: RectangleHorizontal,
	circle: Circle,
	polygon: Waypoints,
	count: Hash,
} as const;

export function MeasurementRow({
	measurement,
	allMeasurements,
	globalWastage,
	pageTitle,
	isDeduction = false,
}: {
	measurement: Measurement;
	allMeasurements: Measurement[];
	globalWastage: number;
	pageTitle?: string;
	isDeduction?: boolean;
}) {
	const colors = useThemeColors();
	const Icon = TYPE_ICONS[measurement.type] ?? Ruler;
	const { actual, rounded } = measurementValueText(
		measurement,
		allMeasurements,
		globalWastage
	);
	const wastage = measurement.wastagePercent;

	return (
		<View
			className={`flex-row items-center gap-2.5 border-border border-t px-4 py-2.5 ${
				isDeduction ? 'pl-10' : ''
			}`}
		>
			{isDeduction ? (
				<Minus color={colors.destructive} size={13} strokeWidth={2.5} />
			) : null}
			<View
				className="h-3 w-3 rounded-full"
				style={{ backgroundColor: measurement.color ?? FALLBACK_COLOR }}
			/>
			<Icon color={colors.mutedForeground} size={14} strokeWidth={2} />
			<View className="flex-1">
				<Text
					className="font-sans-medium text-foreground text-sm"
					numberOfLines={1}
				>
					{measurement.label}
				</Text>
				<Text
					className="font-sans text-muted-foreground text-xs"
					numberOfLines={1}
				>
					{pageTitle ?? `Page ${measurement.page}`}
					{measurement.description ? ` · ${measurement.description}` : ''}
				</Text>
			</View>
			<View className="items-end">
				<Text className="font-sans-semibold text-foreground text-sm">
					{isDeduction ? `−${actual}` : rounded}
				</Text>
				{isDeduction ? null : (
					<Text className="font-sans text-muted-foreground text-xs">
						{actual}
						{wastage !== undefined ? ` · ${wastage}% w` : ''}
					</Text>
				)}
			</View>
		</View>
	);
}
