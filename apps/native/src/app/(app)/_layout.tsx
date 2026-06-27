import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
	const { isLoaded, isSignedIn } = useAuth();

	if (!isLoaded) {
		return null;
	}

	if (!isSignedIn) {
		return <Redirect href="/sign-in" />;
	}

	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: '#001f30' },
				headerTintColor: '#fff0a9',
				headerTitleStyle: { fontWeight: '600' },
			}}
		/>
	);
}
