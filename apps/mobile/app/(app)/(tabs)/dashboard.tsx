import { useUser } from '@clerk/clerk-expo';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { LayoutDashboard } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import {
	type ProjectOverview,
	ProjectOverviewCard,
} from '@/components/dashboard/project-overview-card';
import { ScreenHeader } from '@/components/screen-header';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import {
	getWindowRange,
	MAX_PROJECTS,
	WINDOW_OPTIONS,
	type WindowKey,
} from '@/lib/dashboard';

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
						<ProjectOverviewCard index={index} overview={item} />
					)}
				/>
			)}
		</View>
	);
}
