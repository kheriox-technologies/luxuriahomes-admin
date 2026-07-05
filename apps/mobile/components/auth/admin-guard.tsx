import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { ErrorScreen } from '@/components/ui/error-screen';
import { getRoles, isAdmin, isClient } from '@/lib/roles';

export function AdminGuard({ children }: { children: ReactNode }) {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return null;
	}

	const roles = getRoles(user?.publicMetadata);
	if (isAdmin(roles)) {
		return <>{children}</>;
	}
	// Client-only users (e.g. following a deep link into an admin route) belong
	// on the client surface rather than the error screen.
	if (isClient(roles)) {
		return <Redirect href="/(client)/projects" />;
	}
	return <ErrorScreen code="arbitrary_octopus" />;
}
