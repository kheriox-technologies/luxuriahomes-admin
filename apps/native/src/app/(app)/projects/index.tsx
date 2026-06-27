import { useAuth } from '@clerk/clerk-expo';
import { api } from '@workspace/backend/api';
import { matchesSearch } from '@workspace/shared/projects';
import type { Project } from '@workspace/shared/types';
import { useQuery } from 'convex/react';
import { Stack, useRouter } from 'expo-router';
import { Building2, LogOut, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import { ProjectCard } from '@/components/project-card';

function EmptyState({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<View className="flex-1 items-center justify-center gap-3 px-8 py-16">
			<View className="size-14 items-center justify-center rounded-full bg-muted">
				{icon}
			</View>
			<Text className="font-semibold text-foreground text-lg">{title}</Text>
			<Text className="text-center text-muted-foreground text-sm">
				{description}
			</Text>
		</View>
	);
}

export default function ProjectsScreen() {
	const router = useRouter();
	const { signOut } = useAuth();
	const [search, setSearch] = useState('');
	const allProjects = useQuery(api.clientPortal.projects.list.list, {});

	const trimmedSearch = search.trim();
	const filtered = useMemo(
		() => allProjects?.filter((p) => matchesSearch(p, trimmedSearch)) ?? [],
		[allProjects, trimmedSearch]
	);

	const openProject = (id: Project['_id']) =>
		router.push({
			pathname: '/projects/[projectId]',
			params: { projectId: id },
		});

	const renderBody = () => {
		if (allProjects === undefined) {
			return (
				<View className="flex-1 items-center justify-center py-16">
					<ActivityIndicator />
				</View>
			);
		}

		if (allProjects.length === 0) {
			return (
				<EmptyState
					description="Your projects will appear here once they are set up."
					icon={<Building2 color="#737373" size={26} />}
					title="No projects yet"
				/>
			);
		}

		if (filtered.length === 0) {
			return (
				<EmptyState
					description="Try another name, address, suburb, postcode, or client detail."
					icon={<Search color="#737373" size={26} />}
					title="No matching projects"
				/>
			);
		}

		return (
			<FlatList
				contentContainerClassName="gap-3 p-4"
				data={filtered}
				keyExtractor={(project) => project._id}
				renderItem={({ item }) => (
					<ProjectCard onOpen={() => openProject(item._id)} project={item} />
				)}
			/>
		);
	};

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen
				options={{
					title: 'Projects',
					headerRight: () => (
						<Pressable hitSlop={12} onPress={() => signOut()}>
							<LogOut color="#fff0a9" size={20} />
						</Pressable>
					),
				}}
			/>
			<View className="flex-row items-center gap-2 border-border border-b bg-card px-4 py-3">
				<Search color="#737373" size={18} />
				<TextInput
					autoCapitalize="none"
					className="flex-1 text-base text-foreground"
					onChangeText={setSearch}
					placeholder="Search by name, address, client…"
					placeholderTextColor="#737373"
					returnKeyType="search"
					value={search}
				/>
			</View>
			{renderBody()}
		</View>
	);
}
