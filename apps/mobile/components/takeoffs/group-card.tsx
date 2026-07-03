import { ChevronDown } from 'lucide-react-native';
import { memo, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { GroupBadges } from '@/components/takeoffs/group-badges';
import { MeasurementRow } from '@/components/takeoffs/measurement-row';
import { useThemeColors } from '@/components/theme';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import {
	computeGroupTotals,
	FALLBACK_COLOR,
	type Measurement,
	type TakeoffGroup,
} from '@/lib/takeoffs/math';

export const GroupCard = memo(
	({
		group,
		measurements,
		globalWastage,
		pageTitleByPage,
	}: {
		group: TakeoffGroup;
		measurements: Measurement[];
		globalWastage: number;
		pageTitleByPage: Map<number, string>;
	}) => {
		const colors = useThemeColors();
		const [expanded, setExpanded] = useState(false);

		const groupMeasurements = useMemo(
			() => measurements.filter((m) => m.groupId === group.id && !m.parentId),
			[group.id, measurements]
		);

		const deductionsByParent = useMemo(() => {
			const map = new Map<string, Measurement[]>();
			for (const m of measurements) {
				if (m.groupId === group.id && m.parentId) {
					const list = map.get(m.parentId) ?? [];
					list.push(m);
					map.set(m.parentId, list);
				}
			}
			return map;
		}, [group.id, measurements]);

		const totals = useMemo(
			() => computeGroupTotals(group.id, measurements, globalWastage),
			[globalWastage, group.id, measurements]
		);

		return (
			<Animated.View layout={LinearTransition.duration(200)}>
				<Card className="mx-4 mb-2 overflow-hidden">
					<Pressable
						accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} group ${group.name}`}
						accessibilityRole="button"
						accessibilityState={{ expanded }}
						className="gap-2 p-3.5 active:bg-muted/50"
						onPress={() => setExpanded((prev) => !prev)}
					>
						<View className="flex-row items-center gap-2.5">
							<View
								className="h-3.5 w-3.5 rounded-full"
								style={{ backgroundColor: group.color ?? FALLBACK_COLOR }}
							/>
							<Text className="flex-1 font-sans-semibold text-foreground text-sm">
								{group.name}
							</Text>
							<Text className="font-sans text-muted-foreground text-xs">
								{groupMeasurements.length}
							</Text>
							<View className={cn('rotate-0', expanded && 'rotate-180')}>
								<ChevronDown
									color={colors.mutedForeground}
									size={16}
									strokeWidth={2}
								/>
							</View>
						</View>
						<GroupBadges totals={totals} />
					</Pressable>

					{expanded &&
						groupMeasurements.map((measurement) => (
							<View key={measurement.id}>
								<MeasurementRow
									allMeasurements={measurements}
									globalWastage={globalWastage}
									measurement={measurement}
									pageTitle={pageTitleByPage.get(measurement.page)}
								/>
								{(deductionsByParent.get(measurement.id) ?? []).map(
									(deduction) => (
										<MeasurementRow
											allMeasurements={measurements}
											globalWastage={globalWastage}
											isDeduction
											key={deduction.id}
											measurement={deduction}
											pageTitle={pageTitleByPage.get(deduction.page)}
										/>
									)
								)}
							</View>
						))}
					{expanded && groupMeasurements.length === 0 ? (
						<Text className="border-border border-t px-4 py-3 font-sans text-muted-foreground text-sm">
							No measurements in this group.
						</Text>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);

GroupCard.displayName = 'GroupCard';
