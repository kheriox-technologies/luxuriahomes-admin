import { useClerk, useUser } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { LogOut, Monitor, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/screen-header';
import {
	type ThemePreference,
	useThemeColors,
	useThemePreference,
} from '@/components/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/cn';
import { getRoles } from '@/lib/roles';

const THEME_OPTIONS: {
	value: ThemePreference;
	label: string;
	icon: typeof Sun;
}[] = [
	{ value: 'light', label: 'Light', icon: Sun },
	{ value: 'dark', label: 'Dark', icon: Moon },
	{ value: 'system', label: 'System', icon: Monitor },
];

export default function SettingsScreen() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const { preference, setPreference } = useThemePreference();
	const colors = useThemeColors();

	const fullName = user?.fullName ?? 'User';
	const email = user?.primaryEmailAddress?.emailAddress ?? '';
	const roles = getRoles(user?.publicMetadata);

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="pb-8"
		>
			<ScreenHeader title="Settings" />

			<Card className="mx-4 flex-row items-center gap-3 p-4">
				{user?.imageUrl ? (
					<Image
						accessibilityLabel={`${fullName} profile photo`}
						contentFit="cover"
						source={{ uri: user.imageUrl }}
						style={{ width: 56, height: 56, borderRadius: 28 }}
					/>
				) : (
					<Avatar name={fullName} size="lg" />
				)}
				<View className="flex-1 gap-1">
					<Text className="font-sans-semibold text-base text-foreground">
						{fullName}
					</Text>
					<Text className="font-sans text-muted-foreground text-sm">
						{email}
					</Text>
					<View className="flex-row gap-1.5 pt-0.5">
						{roles.map((role) => (
							<Badge key={role} variant="gold">
								{role}
							</Badge>
						))}
					</View>
				</View>
			</Card>

			<SectionHeader title="Appearance" />
			<Card className="mx-4 flex-row gap-2 p-2">
				{THEME_OPTIONS.map((option) => {
					const Icon = option.icon;
					const selected = preference === option.value;
					return (
						<Pressable
							accessibilityLabel={`Use ${option.label.toLowerCase()} theme`}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							className={cn(
								'min-h-[44px] flex-1 flex-row items-center justify-center gap-2 rounded-lg',
								selected ? 'bg-primary' : 'active:bg-muted'
							)}
							key={option.value}
							onPress={() => setPreference(option.value)}
						>
							<Icon
								color={selected ? '#2b2927' : colors.mutedForeground}
								size={16}
								strokeWidth={2}
							/>
							<Text
								className={cn(
									'font-sans-medium text-sm',
									selected ? 'text-primary-foreground' : 'text-foreground'
								)}
							>
								{option.label}
							</Text>
						</Pressable>
					);
				})}
			</Card>

			<SectionHeader title="About" />
			<Card className="mx-4 p-4">
				<Text className="font-sans text-muted-foreground text-sm">
					Luxuria Homes Builder Portal · v
					{Constants.expoConfig?.version ?? '1.0.0'}
				</Text>
			</Card>

			<View className="px-4 pt-6">
				<Button
					icon={<LogOut color="#ffffff" size={18} strokeWidth={2} />}
					onPress={() => signOut()}
					variant="destructive"
				>
					Sign out
				</Button>
			</View>
		</ScrollView>
	);
}
