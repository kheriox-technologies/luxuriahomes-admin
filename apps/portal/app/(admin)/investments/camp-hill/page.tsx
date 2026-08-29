import { redirect } from 'next/navigation';
import { hasSuperAdminRole } from '@/actions/auth';
import CampHillPageContent from '@/components/investments/camp-hill-page-content';

/**
 * Investment financials are super-admin only. The admin-surface middleware in
 * `proxy.ts` waves every `admin` through, so this page-level check is what
 * actually keeps plain admins out; `requireSuperAdmin` in the Convex functions
 * is the authoritative backstop.
 */
export default async function CampHillPage() {
	if (!(await hasSuperAdminRole())) {
		redirect('/error?error=arbitrary_octopus');
	}
	return <CampHillPageContent />;
}
