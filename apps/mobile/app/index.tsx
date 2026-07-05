import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ErrorScreen } from '@/components/ui/error-screen';
import { getRoles, isAdmin, isClient } from '@/lib/roles';
import { brand } from '@/lib/theme';

// Routes each signed-in user to the surface their role grants. Admins win when a
// user holds both admin and client roles.
export default function Index() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={brand.linen} size="large" />
			</View>
		);
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
