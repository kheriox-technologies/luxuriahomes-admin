'use client';
import { useUser } from '@clerk/nextjs';
import { api } from '@workspace/backend/api';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@workspace/ui/components/sidebar';
import { useQuery } from 'convex/react';
import {
	ChevronDown,
	Drama,
	Group,
	Images,
	IndianRupee,
	Languages,
	LayoutDashboard,
	ListVideo,
	type LucideIcon,
	ShieldCheck,
	UserCheck,
	Users,
	Video,
} from 'lucide-react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemBase {
	icon: LucideIcon;
	path: string;
	title: string;
	url: string;
}

type SidebarItemWithSub = SidebarItemBase & {
	items: Array<{ title: string; url: string; path: string }>;
};

type SidebarItem = SidebarItemBase | SidebarItemWithSub;

function isItemWithSub(item: SidebarItem): item is SidebarItemWithSub {
	return 'items' in item && item.items && item.items.length > 0;
}

// Menu items with path for role-based filtering.
const items: SidebarItem[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		path: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Videos',
		url: '/videos',
		path: '/videos',
		icon: Video,
	},
	{
		title: 'Series',
		url: '/series',
		path: '/series',
		icon: ListVideo,
	},
	{
		title: 'Banners',
		url: '/banners',
		path: '/banners',
		icon: Images,
	},
	{
		title: 'Categories',
		url: '/categories',
		path: '/categories',
		icon: Group,
	},
	{
		title: 'Genres',
		url: '/genres',
		path: '/genres',
		icon: Drama,
	},
	{
		title: 'Languages',
		url: '/languages',
		path: '/languages',
		icon: Languages,
	},
	{
		title: 'Maturity Ratings',
		url: '/maturity-ratings',
		path: '/maturity-ratings',
		icon: UserCheck,
	},
	{
		title: 'Users',
		url: '/users',
		path: '/users',
		icon: Users,
	},
	{
		title: 'Packages',
		url: '#',
		path: '#',
		icon: IndianRupee,
		items: [
			{
				title: 'Rental Packages',
				url: '/rental-packages',
				path: '/rental-packages',
			},
			{
				title: 'Subscription Packages',
				url: '/subscription-packages',
				path: '/subscription-packages',
			},
			{
				title: 'Aspiration Packages',
				url: '/aspiration-packages',
				path: '/aspiration-packages',
			},
		],
	},
	{
		title: 'Administration',
		url: '#',
		path: '#',
		icon: ShieldCheck,
		items: [
			{
				title: 'Custom Roles',
				url: '/administration/roles',
				path: '/administration',
			},
		],
	},
];

function hasPathMatch(pathname: string, allowedPath: string): boolean {
	return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
}

const AppSidebar = () => {
	const pathname = usePathname();
	const permissionsByRole = useQuery(api.permissions.list.list, {}) ?? {};
	const userRoles =
		(useUser().user?.publicMetadata?.roles as string[] | undefined) ?? [];
	const isAdmin = userRoles.includes('admin');

	const allowedPaths = new Set<string>();
	for (const role of userRoles) {
		if (role === 'admin' || role === 'member') {
			continue;
		}
		const permission = permissionsByRole[role];
		if (!permission) {
			continue;
		}
		for (const path of permission.paths) {
			allowedPaths.add(path);
		}
	}

	const hasAccessToPath = (path: string) => {
		if (path === '#') {
			return false;
		}
		if (isAdmin) {
			return true;
		}
		return [...allowedPaths].some((allowedPath) =>
			hasPathMatch(path, allowedPath)
		);
	};

	const filteredItems = items.filter((item) => {
		if (isItemWithSub(item)) {
			const visibleSubItems = item.items.filter((sub) =>
				hasAccessToPath(sub.path)
			);
			return visibleSubItems.length > 0;
		}
		return hasAccessToPath(item.path);
	});

	const isActive = (url: string) => pathname?.startsWith(url);

	const hasActiveSubItem = (
		subItems?: Array<{ title: string; url: string }>
	) => {
		if (!subItems) {
			return false;
		}
		return subItems.some((subItem) => isActive(subItem.url));
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="mt-4 mb-4 flex justify-center">
					<Image alt="Logo" height={32} priority src="/logo.png" width={120} />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{filteredItems.map((item) => {
								if (isItemWithSub(item)) {
									const visibleSubItems = item.items.filter((sub) =>
										hasAccessToPath(sub.path)
									);
									const isOpen = hasActiveSubItem(visibleSubItems);

									return (
										<Collapsible defaultOpen={isOpen} key={item.title}>
											<SidebarMenuItem>
												<CollapsibleTrigger render={<div />}>
													<SidebarMenuButton
														isActive={isOpen}
														tooltip={item.title}
													>
														<item.icon />
														<span>{item.title}</span>
														<ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/menu-item:rotate-180" />
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<SidebarMenuSub>
														{visibleSubItems.map((subItem) => (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton
																	isActive={isActive(subItem.url)}
																	render={
																		<Link
																			href={
																				subItem.url as LinkProps<string>['href']
																			}
																		/>
																	}
																>
																	<span>{subItem.title}</span>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											</SidebarMenuItem>
										</Collapsible>
									);
								}

								return (
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
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
