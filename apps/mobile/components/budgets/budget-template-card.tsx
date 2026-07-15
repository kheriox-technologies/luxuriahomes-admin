import type { Doc } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { MoreVertical } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

export type BudgetTemplate = Doc<'budgetTemplates'>;

export const BudgetTemplateCard = memo(
	({
		template,
		onOpenMenu,
	}: {
		template: BudgetTemplate;
		onOpenMenu: (template: BudgetTemplate) => void;
	}) => {
		const router = useRouter();
		const colors = useThemeColors();

		return (
			<PressableCard
				accessibilityLabel={`Open budget template ${template.title}`}
				className="mx-4 mb-3 p-4"
				onPress={() =>
					router.push({
						pathname: '/(app)/budgets/[budgetTemplateId]',
						params: { budgetTemplateId: template._id },
					})
				}
			>
				<View className="flex-row items-center gap-3">
					<View className="flex-1 gap-0.5">
						<Text
							className="font-sans-semibold text-base text-foreground"
							numberOfLines={1}
						>
							{template.title}
						</Text>
						{template.description ? (
							<Text
								className="font-sans text-muted-foreground text-xs"
								numberOfLines={2}
							>
								{template.description}
							</Text>
						) : null}
					</View>
					<Badge variant="purple">{formatCurrency(template.totalPrice)}</Badge>
					<Pressable
						accessibilityLabel={`Actions for ${template.title}`}
						accessibilityRole="button"
						hitSlop={8}
						onPress={() => onOpenMenu(template)}
					>
						<MoreVertical
							color={colors.mutedForeground}
							size={18}
							strokeWidth={2}
						/>
					</Pressable>
				</View>
			</PressableCard>
		);
	}
);

BudgetTemplateCard.displayName = 'BudgetTemplateCard';
