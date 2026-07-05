import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ClientProjectIndex() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return (
		<Redirect
			href={{
				pathname: '/(client)/projects/[projectId]/inclusions',
				params: { projectId },
			}}
		/>
	);
}
