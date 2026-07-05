import { useUser } from '@clerk/clerk-expo';
import type { ReactNode } from 'react';
import { ErrorScreen } from '@/components/ui/error-screen';
import { getRoles, isAdmin } from '@/lib/roles';

export function AdminGuard({ children }: { children: ReactNode }) {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return null;
	}

	const roles = getRoles(user?.publicMetadata);
	if (!isAdmin(roles)) {
		return <ErrorScreen code="arbitrary_octopus" />;
	}

	return <>{children}</>;
}
