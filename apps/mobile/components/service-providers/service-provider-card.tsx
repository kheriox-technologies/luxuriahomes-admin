import type { Id } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { PressableCard } from '@/components/ui/card';
import type { ServiceProvider } from './types';

export const ServiceProviderCard = memo(function ServiceProviderCard({
	provider,
	projectId,
}: {
	provider: ServiceProvider;
	projectId?: Id<'projects'>;
}) {
	const colors = useThemeColors();
	const router = useRouter();

	return (
		<PressableCard
			accessibilityLabel={`Service provider ${provider.company}`}
			className="mx-4 mb-2 gap-1.5 p-3.5"
			onPress={() =>
				router.push({
					pathname: '/(app)/service-providers/[serviceProviderId]',
					params: projectId
						? { serviceProviderId: provider._id, projectId }
						: { serviceProviderId: provider._id },
				})
			}
		>
			<View className="flex-row items-center gap-2">
				<Text className="flex-1 font-sans-semibold text-foreground text-sm">
					{provider.company}
				</Text>
				<ChevronRight
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
			</View>
			{provider.website ? (
				<Text
					className="font-sans text-muted-foreground text-xs"
					numberOfLines={1}
				>
					{provider.website}
				</Text>
			) : null}
			{provider.qbccLicense ? (
				<Text className="font-sans text-muted-foreground text-xs">
					QBCC {provider.qbccLicense}
				</Text>
			) : null}
		</PressableCard>
	);
});
