import type { Doc } from '@workspace/backend/dataModel';
import { ChevronDown } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { CatalogueInclusionCard } from '@/components/inclusions/catalogue-inclusion-card';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';

type InclusionCategory = Doc<'inclusionCategories'>;
type Inclusion = Doc<'inclusions'>;

export const CatalogueCategoryAccordion = memo(
	function CatalogueCategoryAccordion({
		category,
		inclusions,
		expanded,
		onToggle,
	}: {
		category: InclusionCategory;
		inclusions: Inclusion[];
		expanded: boolean;
		onToggle: () => void;
	}) {
		const colors = useThemeColors();

		return (
			<Animated.View layout={LinearTransition.duration(200)}>
				<Card className="mx-4 mb-2 overflow-hidden">
					<Pressable
						accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} category ${category.name}`}
						accessibilityRole="button"
						accessibilityState={{ expanded }}
						className="gap-2 p-3.5 active:bg-muted/50"
						onPress={onToggle}
					>
						<View className="flex-row items-center gap-2.5">
							<Text className="flex-1 font-sans-semibold text-foreground text-sm">
								{category.name}
							</Text>
							<Text className="font-sans-medium text-muted-foreground text-xs">
								{inclusions.length}
							</Text>
							<View className={cn('rotate-0', expanded && 'rotate-180')}>
								<ChevronDown
									color={colors.mutedForeground}
									size={18}
									strokeWidth={2}
								/>
							</View>
						</View>
						{category.allowance !== undefined ||
						category.labourAllowance !== undefined ? (
							<View className="flex-row flex-wrap items-center gap-1.5">
								{category.allowance !== undefined ? (
									<Badge variant="purple">
										Base {formatCurrency(category.allowance)}
									</Badge>
								) : null}
								{category.labourAllowance !== undefined ? (
									<Badge variant="gold">
										Labour {formatCurrency(category.labourAllowance)}
									</Badge>
								) : null}
							</View>
						) : null}
					</Pressable>

					{expanded ? (
						<View className="pt-1 pb-1.5">
							{inclusions.map((inclusion) => (
								<CatalogueInclusionCard
									inclusion={inclusion}
									key={inclusion._id}
								/>
							))}
						</View>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);
