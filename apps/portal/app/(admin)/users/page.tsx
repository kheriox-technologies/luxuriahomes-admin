import { redirect } from 'next/navigation';
import { hasSuperAdminRole } from '@/actions/auth';
import UsersPageContent from '@/components/users/users-page-content';

export default async function UsersPage() {
	const isSuperAdmin = await hasSuperAdminRole();
	if (!isSuperAdmin) {
		redirect('/error?error=arbitrary_octopus');
	}
	return <UsersPageContent />;
}
