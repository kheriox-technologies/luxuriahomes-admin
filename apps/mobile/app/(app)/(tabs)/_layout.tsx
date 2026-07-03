import { Tabs } from 'expo-router';
import {
	Building2,
	LayoutDashboard,
	Settings,
	SquareKanban,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/components/theme';
import { brand } from '@/lib/theme';

export default function TabsLayout() {
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: isDark ? brand.gold : brand.navy,
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
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color, size }) => (
						<Settings color={color} size={size} strokeWidth={1.75} />
					),
				}}
			/>
		</Tabs>
	);
}
