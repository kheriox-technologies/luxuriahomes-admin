import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
	const { isSignedIn } = useAuth();

	if (isSignedIn) {
		return <Redirect href="/(app)/(tabs)/dashboard" />;
	}

	return <Stack screenOptions={{ headerShown: false }} />;
}
