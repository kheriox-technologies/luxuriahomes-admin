import { redirect } from 'next/navigation';
import { hasAppAccess } from '@/actions/auth';
import AuthGuard from '@/guards/auth-guard';

type AuthenticatedLayoutProps = Readonly<{
	children: React.ReactNode;
}>;
const AuthenticatedLayout = async ({ children }: AuthenticatedLayoutProps) => {
	const hasAccess = await hasAppAccess();
	if (!hasAccess) {
		redirect('/error?error=arbitrary_octopus');
	}
	return (
		<AuthGuard>
			<div className="flex flex-col overflow-x-hidden">{children}</div>
		</AuthGuard>
	);
};

export default AuthenticatedLayout;
