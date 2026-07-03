import type { Doc } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { CalendarDays, ChevronRight, MapPin } from 'lucide-react-native';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { formatDate } from '@/lib/format';

export type Project = Doc<'projects'>;

const statusVariants: Record<Project['status'], BadgeVariant> = {
	not_started: 'default',
	in_progress: 'info',
	completed: 'success',
};

const statusLabels: Record<Project['status'], string> = {
	not_started: 'Not Started',
	in_progress: 'In Progress',
	completed: 'Completed',
};

export const ProjectCard = memo(({ project }: { project: Project }) => {
	const router = useRouter();
	const colors = useThemeColors();
	const address = `${project.address.street}, ${project.address.suburb}`;

	return (
		<PressableCard
			accessibilityLabel={`Open project ${project.name}`}
			className="mx-4 mb-3 p-4"
			onPress={() =>
				router.push({
					pathname: '/(app)/projects/[projectId]/schedule',
					params: { projectId: project._id },
				})
			}
		>
			<View className="flex-row items-start justify-between gap-3">
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
					<View className="flex-row items-center gap-2">
						<Badge variant={statusVariants[project.status]}>
							{statusLabels[project.status]}
						</Badge>
						{project.startDate ? (
							<View className="flex-row items-center gap-1">
								<CalendarDays
									color={colors.mutedForeground}
									size={13}
									strokeWidth={2}
								/>
								<Text className="font-sans text-muted-foreground text-xs">
									{formatDate(project.startDate)}
								</Text>
							</View>
						) : null}
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

ProjectCard.displayName = 'ProjectCard';
