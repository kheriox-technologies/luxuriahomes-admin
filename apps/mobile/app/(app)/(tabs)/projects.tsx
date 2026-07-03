import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
import { Building2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { type Project, ProjectCard } from '@/components/projects/project-card';
import { ScreenHeader } from '@/components/screen-header';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

export default function ProjectsScreen() {
	const projects = useQuery(api.projects.list.list, {});
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!projects) {
			return [];
		}
		const term = search.trim().toLowerCase();
		if (!term) {
			return projects;
		}
		return projects.filter((project: Project) => {
			const haystack =
				`${project.name} ${project.address.street} ${project.address.suburb}`.toLowerCase();
			return haystack.includes(term);
		});
	}, [projects, search]);

	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
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
								search
									? 'Try a different search term.'
									: 'Projects you create in the portal will appear here.'
							}
							icon={Building2}
							title={search ? 'No matching projects' : 'No projects yet'}
						/>
					}
					renderItem={({ item }) => <ProjectCard project={item} />}
				/>
			)}
		</View>
	);
}
