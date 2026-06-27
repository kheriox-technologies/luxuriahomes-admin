import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
	const { isLoaded, isSignedIn } = useAuth();

	if (isLoaded && isSignedIn) {
		return <Redirect href="/projects" />;
	}

	return <Stack screenOptions={{ headerShown: false }} />;
}
