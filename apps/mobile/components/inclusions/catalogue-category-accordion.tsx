import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Doc } from '@workspace/backend/dataModel';
import { EllipsisVertical, Pencil, Plus } from 'lucide-react-native';
import { memo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { CatalogueInclusionCard } from '@/components/inclusions/catalogue-inclusion-card';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

type InclusionCategory = Doc<'inclusionCategories'>;
type Inclusion = Doc<'inclusions'>;

export const CatalogueCategoryAccordion = memo(
	function CatalogueCategoryAccordion({
		category,
		inclusions,
		expanded,
		onToggle,
		onEditCategory,
		onAddInclusion,
		onEditInclusion,
		onDeleteInclusion,
	}: {
		category: InclusionCategory;
		inclusions: Inclusion[];
		expanded: boolean;
		onToggle: () => void;
		onEditCategory: (category: InclusionCategory) => void;
		onAddInclusion: (category: InclusionCategory) => void;
		onEditInclusion: (inclusion: Inclusion) => void;
		onDeleteInclusion: (inclusion: Inclusion) => void;
	}) {
		const colors = useThemeColors();
		const menuRef = useRef<BottomSheetModal>(null);

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
							<Pressable
								accessibilityLabel={`Category ${category.name} actions`}
								accessibilityRole="button"
								className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
								hitSlop={6}
								onPress={() => menuRef.current?.present()}
							>
								<EllipsisVertical
									color={colors.mutedForeground}
									size={18}
									strokeWidth={2}
								/>
							</Pressable>
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
									onDelete={onDeleteInclusion}
									onEdit={onEditInclusion}
								/>
							))}
						</View>
					) : null}
				</Card>

				<ActionSheet
					items={[
						{
							key: 'edit',
							label: 'Edit category',
							icon: Pencil,
							onPress: () => {
								menuRef.current?.dismiss();
								onEditCategory(category);
							},
						},
						{
							key: 'add',
							label: 'Add inclusion',
							icon: Plus,
							onPress: () => {
								menuRef.current?.dismiss();
								onAddInclusion(category);
							},
						},
					]}
					ref={menuRef}
					title={category.name}
				/>
			</Animated.View>
		);
	}
);
