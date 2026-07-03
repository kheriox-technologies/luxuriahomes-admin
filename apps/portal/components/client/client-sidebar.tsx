'use client';
import { BrandLogo } from '@workspace/ui/components/brand-logo';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import { Building2, type LucideIcon } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
	icon: LucideIcon;
	title: string;
	url: string;
}

const items: SidebarItem[] = [
	{
		title: 'Projects',
		url: '/client/projects',
		icon: Building2,
	},
];

const ClientSidebar = () => {
	const pathname = usePathname();
	const isActive = (url: string) => pathname?.startsWith(url);

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="mt-2 mb-2 flex justify-center">
					<Link href="/">
						<BrandLogo
							className="h-14 text-sidebar-foreground"
							label="Luxuria Homes"
						/>
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-2">
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={isActive(item.url)}
										render={
											<Link href={item.url as LinkProps<string>['href']} />
										}
										tooltip={item.title}
									>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default ClientSidebar;
