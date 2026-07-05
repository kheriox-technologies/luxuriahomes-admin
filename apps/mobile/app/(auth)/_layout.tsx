import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { brand } from '@/lib/theme';

function LoadingScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-primary">
			<ActivityIndicator color={brand.linen} size="large" />
		</View>
	);
}

// Gate on Convex auth (not Clerk `isSignedIn`) so we don't bounce to the index
// role router during the brief window after login where Clerk is signed in but
// Convex hasn't finished authenticating — that window otherwise ping-pongs
// against the protected surfaces' `<Unauthenticated>` redirect.
export default function AuthLayout() {
	return (
		<>
			<AuthLoading>
				<LoadingScreen />
			</AuthLoading>
			<Authenticated>
				<Redirect href="/" />
			</Authenticated>
			<Unauthenticated>
				<Stack screenOptions={{ headerShown: false }} />
			</Unauthenticated>
		</>
	);
}
