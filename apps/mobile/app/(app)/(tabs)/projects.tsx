import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { Building2, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { type Project, ProjectCard } from '@/components/projects/project-card';
import { ProjectsKpiBar } from '@/components/projects/projects-kpi-bar';
import { ScreenHeader } from '@/components/screen-header';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { Select, type SelectOption } from '@/components/ui/select';
import { ListSkeleton } from '@/components/ui/skeleton';
import {
	PROJECT_STATUS_LABELS,
	PROJECT_STATUSES,
	type ProjectStatus,
} from '@/lib/project-form';

type StatusFilter = 'all' | ProjectStatus;

const STATUS_FILTER_OPTIONS: SelectOption<StatusFilter>[] = [
	{ value: 'all', label: 'All' },
	...PROJECT_STATUSES.map((status) => ({
		value: status,
		label: PROJECT_STATUS_LABELS[status],
	})),
];

export default function ProjectsScreen() {
	const router = useRouter();
	const colors = useThemeColors();
	const projects = useQuery(api.projects.list.list, {});
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

	const filtered = useMemo(() => {
		if (!projects) {
			return [];
		}
		const term = search.trim().toLowerCase();
		return projects.filter((project: Project) => {
			if (statusFilter !== 'all' && project.status !== statusFilter) {
				return false;
			}
			if (!term) {
				return true;
			}
			const haystack =
				`${project.name} ${project.address.street} ${project.address.suburb}`.toLowerCase();
			return haystack.includes(term);
		});
	}, [projects, search, statusFilter]);

	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
				rightSlot={<NotificationBell />}
				subtitle={projects ? `${projects.length} projects` : undefined}
				title="Projects"
			/>
			<View className="px-4 pb-3">
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search projects"
					value={search}
				/>
			</View>
			{projects === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={filtered}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description={
								search || statusFilter !== 'all'
									? 'Try a different search or filter.'
									: 'Tap “Add Project” to create your first project.'
							}
							icon={Building2}
							title={
								search || statusFilter !== 'all'
									? 'No matching projects'
									: 'No projects yet'
							}
						/>
					}
					ListHeaderComponent={
						<View className="gap-3 pt-1 pb-3">
							<ProjectsKpiBar projects={projects} />
							<View className="flex-row items-center gap-3 px-4">
								<Select
									className="flex-1"
									onChange={setStatusFilter}
									options={STATUS_FILTER_OPTIONS}
									title="Filter by status"
									value={statusFilter}
								/>
								<Button
									icon={
										<Plus color={colors.foreground} size={18} strokeWidth={2} />
									}
									onPress={() => router.push('/(app)/projects/add')}
								>
									Add Project
								</Button>
							</View>
						</View>
					}
					renderItem={({ item }) => <ProjectCard project={item} />}
				/>
			)}
		</View>
	);
}
