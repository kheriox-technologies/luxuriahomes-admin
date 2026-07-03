import { UserButton } from '@clerk/nextjs';
import { env } from '@workspace/env/portal';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@workspace/ui/components/sidebar';
import { redirect } from 'next/navigation';
import { hasSurfaceAccess } from '@/actions/auth';
import AppModeToggle from '@/components/app-mode-toggle';
import AppSidebar from '@/components/app-sidebar';
import Footer from '@/components/footer';
import NotificationBell from '@/components/notifications/notification-bell';
import SurfaceSwitcher from '@/components/surface-switcher';
import AuthGuard from '@/guards/auth-guard';

type AuthenticatedLayoutProps = Readonly<{
	children: React.ReactNode;
}>;
const AuthenticatedLayout = async ({ children }: AuthenticatedLayoutProps) => {
	const hasAccess = await hasSurfaceAccess('admin');
	if (!hasAccess) {
		redirect('/error?error=arbitrary_octopus');
	}
	return (
		<main className="flex h-full w-full flex-col">
			<AuthGuard>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset className="min-w-0">
						<main className="flex min-h-0 flex-1 flex-col">
							<div className="flex items-center justify-between border-b p-4">
								<div className="flex items-center gap-2">
									<SidebarTrigger />
									<h1 className="font-semibold text-xl">
										{env.NEXT_PUBLIC_APP_NAME}
									</h1>
								</div>
								<div className="flex items-center gap-4">
									<SurfaceSwitcher current="admin" />
									<AppModeToggle />
									<NotificationBell />
									<UserButton />
								</div>
							</div>
							<div className="flex min-h-0 flex-1 overflow-auto p-4">
								{children}
							</div>
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
