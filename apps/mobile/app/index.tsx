import { useUser } from '@clerk/clerk-expo';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ErrorScreen } from '@/components/ui/error-screen';
import { getRoles, isAdmin, isClient } from '@/lib/roles';
import { brand } from '@/lib/theme';

function LoadingScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-primary">
			<ActivityIndicator color={brand.linen} size="large" />
		</View>
	);
}

// Routes each signed-in user to the surface their role grants. Admins win when a
// user holds both admin and client roles. Reaching the error screen here means
// "signed in but no role assigned" — genuinely unauthorized.
function RoleRouter() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return <LoadingScreen />;
	}

	const roles = getRoles(user?.publicMetadata);
	if (isAdmin(roles)) {
		return <Redirect href="/(app)/(tabs)/dashboard" />;
	}
	if (isClient(roles)) {
		return <Redirect href="/(client)/projects" />;
	}
	return <ErrorScreen code="arbitrary_octopus" />;
}

// Gate on Convex auth (mirrors the (app)/(auth) layouts) so signed-out users land
// on sign-in instead of falling through the role router to the unauthorized screen.
export default function Index() {
	return (
		<>
			<AuthLoading>
				<LoadingScreen />
			</AuthLoading>
			<Unauthenticated>
				<Redirect href="/(auth)/sign-in" />
			</Unauthenticated>
			<Authenticated>
				<RoleRouter />
			</Authenticated>
		</>
	);
}
