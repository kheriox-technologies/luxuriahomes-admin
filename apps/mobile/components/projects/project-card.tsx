import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import {
	CalendarDays,
	EllipsisVertical,
	MapPin,
	Pencil,
	Trash2,
} from 'lucide-react-native';
import { memo, useRef } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate } from '@/lib/format';

export type Project = Doc<'projects'>;

const statusVariants: Record<Project['status'], BadgeVariant> = {
	not_started: 'info',
	in_progress: 'warning',
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
	const sheetRef = useRef<BottomSheetModal>(null);
	const removeProject = useMutation(api.projects.remove.remove);

	const address = `${project.address.street}, ${project.address.suburb}`;
	const { quotePrice, expenses, received } = project;
	const remaining =
		quotePrice === undefined || expenses === undefined
			? undefined
			: quotePrice - expenses;
	const profit =
		received === undefined || expenses === undefined
			? undefined
			: received - expenses;

	const openDetails = () =>
		router.push({
			pathname: '/(app)/projects/[projectId]/schedule',
			params: { projectId: project._id },
		});

	const handleEdit = () => {
		sheetRef.current?.dismiss();
		router.push({
			pathname: '/(app)/projects/edit/[projectId]',
			params: { projectId: project._id },
		});
	};

	const confirmDelete = () => {
		sheetRef.current?.dismiss();
		Alert.alert(
			'Delete project?',
			`Delete "${project.name}"? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeProject({ projectId: project._id }).catch(() => {
							Alert.alert(
								'Could not delete project',
								'Please try again in a moment.'
							);
						});
					},
				},
			]
		);
	};

	return (
		<>
			<PressableCard
				accessibilityLabel={`Open project ${project.name}`}
				className="mx-4 mb-3 p-4"
				onPress={openDetails}
			>
				<View className="flex-row items-start justify-between gap-3">
					<View className="flex-1 gap-2">
						<Text className="font-sans-semibold text-base text-foreground">
							{project.name}
						</Text>
						<View className="flex-row items-center gap-1.5">
							<MapPin
								color={colors.mutedForeground}
								size={14}
								strokeWidth={2}
							/>
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
					<Pressable
						accessibilityLabel={`Actions for ${project.name}`}
						accessibilityRole="button"
						className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
						hitSlop={8}
						onPress={() => sheetRef.current?.present()}
					>
						<EllipsisVertical
							color={colors.mutedForeground}
							size={18}
							strokeWidth={2}
						/>
					</Pressable>
				</View>
				<View className="mt-3 flex-row justify-between gap-2 border-border border-t pt-3">
					<View className="flex-1 gap-0.5">
						<Text className="font-sans text-muted-foreground text-xs">
							Quote
						</Text>
						<Text className="font-sans-semibold text-foreground text-sm">
							{formatCurrency(quotePrice)}
						</Text>
						{remaining === undefined ? null : (
							<Text
								className={cn(
									'font-sans text-xs',
									remaining >= 0 ? 'text-success' : 'text-destructive'
								)}
							>
								{remaining >= 0
									? `${formatCurrency(remaining)} left`
									: `${formatCurrency(Math.abs(remaining))} over`}
							</Text>
						)}
					</View>
					<View className="flex-1 items-center gap-0.5">
						<Text className="font-sans text-muted-foreground text-xs">
							Expenses
						</Text>
						<Text className="font-sans-semibold text-foreground text-sm">
							{formatCurrency(expenses)}
						</Text>
					</View>
					<View className="flex-1 items-end gap-0.5">
						<Text className="font-sans text-muted-foreground text-xs">
							Received
						</Text>
						<Text className="font-sans-semibold text-foreground text-sm">
							{formatCurrency(received)}
						</Text>
						{profit === undefined ? null : (
							<Text
								className={cn(
									'font-sans text-xs',
									profit >= 0 ? 'text-success' : 'text-destructive'
								)}
							>
								{profit >= 0
									? `${formatCurrency(profit)} profit`
									: `${formatCurrency(Math.abs(profit))} loss`}
							</Text>
						)}
					</View>
				</View>
			</PressableCard>
			<ActionSheet
				items={[
					{
						key: 'edit',
						label: 'Edit',
						icon: Pencil,
						onPress: handleEdit,
					},
					{
						key: 'delete',
						label: 'Delete',
						icon: Trash2,
						destructive: true,
						onPress: confirmDelete,
					},
				]}
				ref={sheetRef}
				title={project.name}
			/>
		</>
	);
});

ProjectCard.displayName = 'ProjectCard';
