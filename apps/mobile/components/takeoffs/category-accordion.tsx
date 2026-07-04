import { ChevronDown, Folder, RulerDimensionLine } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { GroupCard } from '@/components/takeoffs/group-card';
import { useThemeColors } from '@/components/theme';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import type {
	Measurement,
	TakeoffCategory,
	TakeoffGroup,
} from '@/lib/takeoffs/math';

const AMBER = '#d97706';

export const CategoryAccordion = memo(
	({
		category,
		groups,
		measurements,
		globalWastage,
		pageTitleByPage,
		expanded,
		onToggle,
		measurementCount,
		searchText,
	}: {
		category: TakeoffCategory;
		groups: TakeoffGroup[];
		measurements: Measurement[];
		globalWastage: number;
		pageTitleByPage: Map<number, string>;
		expanded: boolean;
		onToggle: () => void;
		measurementCount: number;
		searchText?: string;
	}) => {
		const colors = useThemeColors();

		return (
			<Animated.View layout={LinearTransition.duration(200)}>
				<Card className="mx-4 mb-2 overflow-hidden">
					<Pressable
						accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} category ${category.name}`}
						accessibilityRole="button"
						accessibilityState={{ expanded }}
						className="flex-row items-center gap-2.5 p-3.5 active:bg-muted/50"
						onPress={onToggle}
					>
						<Folder color={AMBER} size={16} strokeWidth={2} />
						<Text className="flex-1 font-sans-semibold text-foreground text-sm">
							{category.name}
						</Text>
						<View className="flex-row items-center gap-1">
							<RulerDimensionLine
								color={colors.mutedForeground}
								size={13}
								strokeWidth={2}
							/>
							<Text className="font-sans-medium text-muted-foreground text-xs">
								{measurementCount}
							</Text>
						</View>
						<View className={cn('rotate-0', expanded && 'rotate-180')}>
							<ChevronDown
								color={colors.mutedForeground}
								size={18}
								strokeWidth={2}
							/>
						</View>
					</Pressable>

					{expanded ? (
						<View className="pb-1.5">
							{groups.map((group) => (
								<GroupCard
									globalWastage={globalWastage}
									group={group}
									key={group.id}
									measurements={measurements}
									pageTitleByPage={pageTitleByPage}
									searchText={searchText}
								/>
							))}
						</View>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);

CategoryAccordion.displayName = 'CategoryAccordion';
