import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/shared/types';
import { useQuery } from 'convex/react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

function Row({ label, value }: { label: string; value: string }) {
	return (
		<View className="gap-1 rounded-lg border border-border bg-card p-4">
			<Text className="font-medium text-muted-foreground text-xs uppercase">
				{label}
			</Text>
			<Text className="text-base text-card-foreground">{value}</Text>
		</View>
	);
}

export default function ProjectDetailScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const project = useQuery(api.clientPortal.projects.get.get, {
		projectId: projectId as Id<'projects'>,
	});

	if (project === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
			</View>
		);
	}

	const { street, suburb, state, postcode } = project.address;

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="gap-4 p-4"
		>
			<Stack.Screen options={{ title: project.name }} />
			<Row label="Project" value={project.name} />
			<Row
				label="Address"
				value={`${street}\n${suburb}, ${state} ${postcode}`}
			/>
			<Row label="Status" value={project.status.replaceAll('_', ' ')} />
		</ScrollView>
	);
}
