import { Tabs } from 'expo-router';
import { Building2, LayoutDashboard, SquareKanban } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useAppDrawer } from '@/components/navigation/app-drawer';
import { TabAvatarIcon } from '@/components/navigation/tab-avatar-icon';
import { useThemeColors } from '@/components/theme';
import { brand } from '@/lib/theme';

export default function TabsLayout() {
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { open } = useAppDrawer();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: isDark ? brand.linen : brand.ink,
				tabBarInactiveTintColor: colors.mutedForeground,
				tabBarStyle: {
					backgroundColor: colors.card,
					borderTopColor: colors.border,
				},
				tabBarLabelStyle: {
					fontFamily: 'Inter_500Medium',
					fontSize: 11,
				},
			}}
		>
			<Tabs.Screen
				name="dashboard"
				options={{
					title: 'Dashboard',
					tabBarIcon: ({ color, size }) => (
						<LayoutDashboard color={color} size={size} strokeWidth={1.75} />
					),
				}}
			/>
			<Tabs.Screen
				name="projects"
				options={{
					title: 'Projects',
					tabBarIcon: ({ color, size }) => (
						<Building2 color={color} size={size} strokeWidth={1.75} />
					),
				}}
			/>
			<Tabs.Screen
				name="tasks"
				options={{
					title: 'Tasks',
					tabBarIcon: ({ color, size }) => (
						<SquareKanban color={color} size={size} strokeWidth={1.75} />
					),
				}}
			/>
			<Tabs.Screen
				listeners={{
					tabPress: (event) => {
						event.preventDefault();
						open();
					},
				}}
				name="menu"
				options={{
					title: 'Menu',
					tabBarIcon: ({ size, focused }) => (
						<TabAvatarIcon focused={focused} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
