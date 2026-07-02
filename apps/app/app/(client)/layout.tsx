import { UserButton } from '@clerk/nextjs';
import { env } from '@workspace/env/app';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@workspace/ui/components/sidebar';
import { redirect } from 'next/navigation';
import { hasSurfaceAccess } from '@/actions/auth';
import ClientSidebar from '@/components/client/client-sidebar';
import Footer from '@/components/footer';
import SurfaceSwitcher from '@/components/surface-switcher';
import AuthGuard from '@/guards/auth-guard';

type ClientLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

const ClientLayout = async ({ children }: ClientLayoutProps) => {
	const hasAccess = await hasSurfaceAccess('client');
	if (!hasAccess) {
		redirect('/error?error=arbitrary_octopus');
	}
	return (
		<main className="flex h-full w-full flex-col">
			<AuthGuard>
				<SidebarProvider>
					<ClientSidebar />
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
									<SurfaceSwitcher current="client" />
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

export default ClientLayout;
