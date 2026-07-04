import { CalendarClock, ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { formatShortDate } from '@/lib/format';

const MS_PER_DAY = 86_400_000;

export function ScheduleToolbar({
	startDate,
	endDate,
	days,
	onToday,
	onExpandAll,
	onCollapseAll,
}: {
	startDate: number;
	endDate: number;
	days: number;
	onToday: () => void;
	onExpandAll: () => void;
	onCollapseAll: () => void;
}) {
	const colors = useThemeColors();
	return (
		<View className="flex-row items-center justify-between gap-3 border-border border-b bg-background px-4 py-2">
			<View className="flex-1">
				<Text className="font-sans text-muted-foreground text-xs">
					<Text className="font-sans-medium text-foreground text-sm">
						{formatShortDate(startDate)} – {formatShortDate(endDate)}
					</Text>{' '}
					({days} {days === 1 ? 'day' : 'days'})
				</Text>
			</View>
			<View className="flex-row items-center gap-1">
				<Pressable
					accessibilityLabel="Scroll to today"
					accessibilityRole="button"
					className="h-9 flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3 active:bg-muted"
					hitSlop={4}
					onPress={onToday}
				>
					<CalendarClock color={colors.foreground} size={15} strokeWidth={2} />
					<Text className="font-sans-medium text-foreground text-sm">
						Today
					</Text>
				</Pressable>
				<Pressable
					accessibilityLabel="Expand all stages"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={onExpandAll}
				>
					<ChevronsDown color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
				<Pressable
					accessibilityLabel="Collapse all stages"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={onCollapseAll}
				>
					<ChevronsUp color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
			</View>
		</View>
	);
}

export function computeScheduleSpan(
	projectStartDate: number | undefined,
	stages: { startDate: number; endDate: number }[],
	tasks: { startDate: number; endDate: number }[]
): { start: number; end: number; days: number } {
	const starts = [
		...stages.map((s) => s.startDate),
		...tasks.map((t) => t.startDate),
	];
	const ends = [
		...stages.map((s) => s.endDate),
		...tasks.map((t) => t.endDate),
	];
	const derivedStart = starts.length > 0 ? Math.min(...starts) : Date.now();
	const start = projectStartDate ?? derivedStart;
	const end = ends.length > 0 ? Math.max(...ends) : start;
	const days = Math.max(1, Math.round((end - start) / MS_PER_DAY) + 1);
	return { start, end, days };
}
