import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { Users } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { ClientCard } from '@/components/projects/client-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';

export default function ClientsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const project = useQuery(api.projects.get.get, {
		projectId: projectId as Id<'projects'>,
	});

	if (project === undefined) {
		return <ListSkeleton rows={2} />;
	}

	const clients = project?.clients ?? [];

	if (clients.length === 0) {
		return (
			<EmptyState
				description="Add clients to this project in the web portal."
				icon={Users}
				title="No clients"
			/>
		);
	}

	return (
		<ScrollView className="flex-1" contentContainerClassName="pb-6 pt-1">
			{clients.map((client) => (
				<ClientCard
					client={client}
					key={client.email}
					projectId={projectId as Id<'projects'>}
				/>
			))}
		</ScrollView>
	);
}
