import type { Doc } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { MoreVertical } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { PressableCard } from '@/components/ui/card';

export type QuotationTemplate = Doc<'quoteTemplates'>;

export const QuotationTemplateCard = memo(
	({
		template,
		onOpenMenu,
	}: {
		onOpenMenu: (template: QuotationTemplate) => void;
		template: QuotationTemplate;
	}) => {
		const router = useRouter();
		const colors = useThemeColors();

		return (
			<PressableCard
				accessibilityLabel={`Open quotation template ${template.name}`}
				className="mx-4 mb-3 p-4"
				onPress={() =>
					router.push({
						pathname: '/(app)/quotation-templates/[templateId]/items',
						params: { templateId: template._id },
					})
				}
			>
				<View className="flex-row items-center gap-3">
					<View className="flex-1 gap-0.5">
						<Text
							className="font-sans-semibold text-base text-foreground"
							numberOfLines={1}
						>
							{template.name}
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
					<Pressable
						accessibilityLabel={`Actions for ${template.name}`}
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

QuotationTemplateCard.displayName = 'QuotationTemplateCard';
