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
	Bell,
	Building2,
	CalendarDays,
	ChevronDown,
	FileText,
	List,
	ListTodo,
	type LucideIcon,
	Package,
	Settings,
	SquaresIntersect,
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
		title: 'Projects',
		url: '/projects',
		path: '/projects',
		icon: Building2,
	},
	{
		title: 'Inclusions',
		url: '/inclusions',
		path: '/inclusions',
		icon: SquaresIntersect,
	},
	{
		title: 'Materials',
		url: '/materials',
		path: '/materials',
		icon: Package,
	},
	{
		title: 'Schedules',
		url: '/schedules',
		path: '/schedules',
		icon: CalendarDays,
	},
	{
		title: 'Tasks',
		url: '/tasks',
		path: '/tasks',
		icon: ListTodo,
	},
	{
		title: 'Documents',
		url: '/documents',
		path: '/documents',
		icon: FileText,
	},
	{
		title: 'Notifications',
		url: '/notifications',
		path: '/notifications',
		icon: Bell,
	},
	{
		title: 'Lists',
		url: '#',
		path: '#',
		icon: List,
		items: [
			{ title: 'Locations', url: '/locations', path: '/locations' },
			{ title: 'Trades', url: '/trades', path: '/trades' },
			{ title: 'Vendors', url: '/vendors', path: '/vendors' },
			{
				title: 'Material Colors',
				url: '/material-colors',
				path: '/material-colors',
			},
			{
				title: 'Document Folders',
				url: '/document-folders',
				path: '/document-folders',
			},
			{
				title: 'Service Providers',
				url: '/service-providers',
				path: '/service-providers',
			},
			{ title: 'Budgets', url: '/budgets', path: '/budgets' },
		],
	},
	{
		title: 'Settings',
		url: '#',
		path: '#',
		icon: Settings,
		items: [
			{
				title: 'Email Templates',
				url: '/settings/email-templates',
				path: '/settings/email-templates',
			},
			{
				title: 'Email Signatures',
				url: '/settings/signatures',
				path: '/settings/signatures',
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
				<div className="mt-2 mb-2 flex justify-center">
					<Link href="/">
						<Image
							alt="Logo"
							height={32}
							priority
							src="/lh-admin-logo-no-bg.png"
							width={150}
						/>
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-2">
							{filteredItems.map((item) => {
								if (isItemWithSub(item)) {
									const visibleSubItems = item.items.filter((sub) =>
										hasAccessToPath(sub.path)
									);
									const isOpen = hasActiveSubItem(visibleSubItems);

									return (
										<Collapsible defaultOpen={isOpen} key={item.title}>
											<SidebarMenuItem>
												<CollapsibleTrigger
													nativeButton={false}
													render={<div />}
												>
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
