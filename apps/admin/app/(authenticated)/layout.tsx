import { UserButton } from '@clerk/nextjs';
import { env } from '@workspace/env/admin';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@workspace/ui/components/sidebar';
import { redirect } from 'next/navigation';
import { hasAppAccess } from '@/actions/auth';
import AppSidebar from '@/components/app-sidebar';
import Footer from '@/components/footer';
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
		<main className="flex min-h-screen w-full flex-col">
			<AuthGuard>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<main className="flex min-h-0 flex-1 flex-col">
							<div className="flex items-center justify-between border-b p-4">
								<div className="flex items-center gap-2">
									<SidebarTrigger />
									<h1 className="font-semibold text-xl">
										{env.NEXT_PUBLIC_APP_NAME}
									</h1>
								</div>
								<div className="flex items-center gap-4">
									<UserButton />
								</div>
							</div>
							<div className="flex flex-1 p-4">{children}</div>
							<div className="mt-auto flex flex-col border-t p-2">
								<Footer />
							</div>
						</main>
					</SidebarInset>
				</SidebarProvider>
			</AuthGuard>
		</main>
	);
};

export default AuthenticatedLayout;
