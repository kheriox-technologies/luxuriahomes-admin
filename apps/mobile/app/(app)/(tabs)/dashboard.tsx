import { useUser } from '@clerk/clerk-expo';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	CheckCircle2,
	CircleDashed,
	CirclePlay,
	LayoutDashboard,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import {
	type OverviewTask,
	type ProjectOverview,
	ProjectOverviewCard,
} from '@/components/dashboard/project-overview-card';
import { ScreenHeader } from '@/components/screen-header';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import type { ScheduleStatus } from '@/components/ui/status-pill';
import {
	getWindowRange,
	MAX_PROJECTS,
	WINDOW_OPTIONS,
	type WindowKey,
} from '@/lib/dashboard';

const STATUS_OPTIONS: {
	status: ScheduleStatus;
	icon: typeof CircleDashed;
}[] = [
	{ status: 'Pending', icon: CircleDashed },
	{ status: 'In Progress', icon: CirclePlay },
	{ status: 'Complete', icon: CheckCircle2 },
];

export default function DashboardScreen() {
	const { user } = useUser();
	const projects = useQuery(api.projects.list.list, {});
	const [windowKey, setWindowKey] = useState<WindowKey>('1week');
	const [selectedIds, setSelectedIds] = useState<Id<'projects'>[]>([]);

	// Auto-select the first MAX_PROJECTS by start date, matching the portal.
	useEffect(() => {
		if (projects && selectedIds.length === 0 && projects.length > 0) {
			const sorted = [...projects].sort(
				(a, b) =>
					(a.startDate ?? Number.MAX_SAFE_INTEGER) -
					(b.startDate ?? Number.MAX_SAFE_INTEGER)
			);
			setSelectedIds(
				sorted.slice(0, MAX_PROJECTS).map((project) => project._id)
			);
		}
	}, [projects, selectedIds.length]);

	const { rangeStart, rangeEnd } = useMemo(
		() => getWindowRange(windowKey),
		[windowKey]
	);

	const overview = useQuery(
		api.dashboard.scheduleOverview.scheduleOverview,
		selectedIds.length > 0
			? { projectIds: selectedIds, rangeStart, rangeEnd }
			: 'skip'
	);

	const updateTaskStatus = useMutation(
		api.projectTasks.updateStatus.updateStatus
	);
	const [statusTarget, setStatusTarget] = useState<OverviewTask | null>(null);
	const sheetRef = useRef<BottomSheetModal>(null);

	const openStatusSheet = useCallback((task: OverviewTask) => {
		setStatusTarget(task);
		sheetRef.current?.present();
	}, []);

	const sheetItems: ActionSheetItem[] = useMemo(() => {
		if (!statusTarget) {
			return [];
		}
		return STATUS_OPTIONS.map(({ status, icon }) => ({
			key: status,
			label: status === statusTarget.status ? `${status} (current)` : status,
			icon,
			selected: status === statusTarget.status,
			onPress: () => {
				sheetRef.current?.dismiss();
				if (status === statusTarget.status) {
					return;
				}
				updateTaskStatus({
					taskId: statusTarget._id as Id<'projectTasks'>,
					status,
				});
			},
		}));
	}, [statusTarget, updateTaskStatus]);

	const toggleProject = (projectId: Id<'projects'>) => {
		setSelectedIds((prev) => {
			if (prev.includes(projectId)) {
				return prev.filter((id) => id !== projectId);
			}
			if (prev.length >= MAX_PROJECTS) {
				return prev;
			}
			return [...prev, projectId];
		});
	};

	const firstName = user?.firstName ?? 'there';
	const isLoading =
		projects === undefined ||
		(selectedIds.length > 0 && overview === undefined);

	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
				subtitle={`Here's what's coming up, ${firstName}`}
				title="Dashboard"
			/>

			<View className="gap-2 pb-3">
				<ScrollView
					contentContainerClassName="gap-2 px-4"
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{WINDOW_OPTIONS.map((option) => (
						<Chip
							key={option.value}
							label={option.label}
							onPress={() => setWindowKey(option.value)}
							selected={windowKey === option.value}
						/>
					))}
				</ScrollView>
				{projects && projects.length > 0 ? (
					<ScrollView
						contentContainerClassName="gap-2 px-4"
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						{projects.map((project) => (
							<Chip
								key={project._id}
								label={project.name}
								onPress={() => toggleProject(project._id)}
								selected={selectedIds.includes(project._id)}
							/>
						))}
					</ScrollView>
				) : null}
				<Text className="px-4 font-sans text-muted-foreground text-xs">
					Up to {MAX_PROJECTS} projects at a time
				</Text>
			</View>

			{isLoading ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={(overview ?? []) as ProjectOverview[]}
					keyExtractor={(item) => item.projectId}
					ListEmptyComponent={
						<EmptyState
							description="Select one or more projects to see upcoming tasks and orders."
							icon={LayoutDashboard}
							title="Nothing to show"
						/>
					}
					renderItem={({ item, index }) => (
						<ProjectOverviewCard
							index={index}
							onTaskStatusPress={openStatusSheet}
							overview={item}
						/>
					)}
				/>
			)}
			<ActionSheet
				items={sheetItems}
				onDismiss={() => setStatusTarget(null)}
				ref={sheetRef}
				title={statusTarget ? `Set status — ${statusTarget.name}` : undefined}
			/>
		</View>
	);
}
