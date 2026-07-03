import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ProjectIndex() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return (
		<Redirect
			href={{
				pathname: '/(app)/projects/[projectId]/schedule',
				params: { projectId },
			}}
		/>
	);
}
