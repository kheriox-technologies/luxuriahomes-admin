import type { Doc } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { PressableCard } from '@/components/ui/card';

export type Project = Doc<'projects'>;

// Client-facing project card: navigates into the client surface and omits the
// builder financials, status and dates that admins see.
export const ClientProjectCard = memo(({ project }: { project: Project }) => {
	const router = useRouter();
	const colors = useThemeColors();
	const address = `${project.address.street}, ${project.address.suburb}`;

	return (
		<PressableCard
			accessibilityLabel={`Open project ${project.name}`}
			className="mx-4 mb-3 p-4"
			onPress={() =>
				router.push({
					pathname: '/(client)/projects/[projectId]',
					params: { projectId: project._id },
				})
			}
		>
			<View className="flex-row items-center justify-between gap-3">
				<View className="flex-1 gap-2">
					<Text className="font-sans-semibold text-base text-foreground">
						{project.name}
					</Text>
					<View className="flex-row items-center gap-1.5">
						<MapPin color={colors.mutedForeground} size={14} strokeWidth={2} />
						<Text
							className="flex-1 font-sans text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{address}
						</Text>
					</View>
				</View>
				<ChevronRight
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
			</View>
		</PressableCard>
	);
});

ClientProjectCard.displayName = 'ClientProjectCard';
