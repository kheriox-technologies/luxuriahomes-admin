import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { ErrorScreen } from '@/components/ui/error-screen';
import { getRoles, isAdmin, isClient } from '@/lib/roles';

export function ClientGuard({ children }: { children: ReactNode }) {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return null;
	}

	const roles = getRoles(user?.publicMetadata);
	if (isClient(roles)) {
		return <>{children}</>;
	}
	// Admins win: a dual-role user reaching a client route is sent to the admin app.
	if (isAdmin(roles)) {
		return <Redirect href="/(app)/(tabs)/dashboard" />;
	}
	return <ErrorScreen code="arbitrary_octopus" />;
}
