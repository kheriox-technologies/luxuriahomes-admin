import AuthGuard from '@/guards/auth-guard';

type AuthenticatedLayoutProps = Readonly<{
	children: React.ReactNode;
}>;
const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
	return (
		<AuthGuard>
			<div className="flex flex-col overflow-x-hidden">{children}</div>
		</AuthGuard>
	);
};

export default AuthenticatedLayout;
