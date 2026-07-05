import type { Doc } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

type Inclusion = Doc<'inclusions'>;

function variantLabel(count: number): string {
	return `${count} ${count === 1 ? 'Variant' : 'Variants'}`;
}

export const CatalogueInclusionCard = memo(function CatalogueInclusionCard({
	inclusion,
}: {
	inclusion: Inclusion;
}) {
	const colors = useThemeColors();
	const router = useRouter();

	return (
		<PressableCard
			accessibilityLabel={`Inclusion ${inclusion.title}`}
			className="mx-4 mb-2 flex-row items-center gap-2 p-3.5"
			onPress={() =>
				router.push({
					pathname: '/(app)/inclusions/[inclusionId]',
					params: { inclusionId: inclusion._id },
				})
			}
		>
			<View className="flex-1 gap-1.5">
				<Text className="font-sans-semibold text-foreground text-sm">
					{inclusion.title}
				</Text>
				<View className="flex-row flex-wrap items-center gap-1.5">
					{inclusion.variantCount > 0 ? (
						<Badge variant="info">{variantLabel(inclusion.variantCount)}</Badge>
					) : null}
					{inclusion.standardPrice !== undefined ? (
						<Badge variant="purple">
							Base {formatCurrency(inclusion.standardPrice)}
						</Badge>
					) : null}
					{inclusion.standardLabourPrice !== undefined ? (
						<Badge variant="gold">
							Labour {formatCurrency(inclusion.standardLabourPrice)}
						</Badge>
					) : null}
				</View>
			</View>
			<ChevronRight color={colors.mutedForeground} size={18} strokeWidth={2} />
		</PressableCard>
	);
});
