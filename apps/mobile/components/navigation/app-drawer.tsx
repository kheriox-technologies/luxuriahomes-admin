import { useClerk, useUser } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FileText, LogOut, Users, Wallet } from 'lucide-react-native';
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	SlideInLeft,
	SlideOutLeft,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Avatar } from '@/components/ui/avatar';
import { getRoles, isSuperAdmin } from '@/lib/roles';

interface AppDrawerContextValue {
	close: () => void;
	isOpen: boolean;
	open: () => void;
}

const AppDrawerContext = createContext<AppDrawerContextValue | null>(null);

export function useAppDrawer() {
	const value = useContext(AppDrawerContext);
	if (!value) {
		throw new Error('useAppDrawer must be used within an AppDrawerProvider');
	}
	return value;
}

export function AppDrawerProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

	return (
		<AppDrawerContext.Provider value={value}>
			{children}
			{isOpen ? <AppDrawer onClose={close} /> : null}
		</AppDrawerContext.Provider>
	);
}

function AppDrawer({ onClose }: { onClose: () => void }) {
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const router = useRouter();
	const { user } = useUser();
	const { signOut } = useClerk();

	const fullName = user?.fullName ?? 'User';
	const email = user?.primaryEmailAddress?.emailAddress ?? '';
	const version = Constants.expoConfig?.version ?? '1.0.0';
	const canViewUsers = isSuperAdmin(getRoles(user?.publicMetadata));

	useEffect(() => {
		const subscription = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				onClose();
				return true;
			}
		);
		return () => subscription.remove();
	}, [onClose]);

	const handleSignOut = useCallback(() => {
		onClose();
		signOut();
	}, [onClose, signOut]);

	return (
		<View className="absolute inset-0" style={{ zIndex: 50 }}>
			<Animated.View
				className="absolute inset-0 bg-black/50"
				entering={FadeIn}
				exiting={FadeOut}
			>
				<Pressable
					accessibilityLabel="Close menu"
					accessibilityRole="button"
					className="flex-1"
					onPress={onClose}
				/>
			</Animated.View>

			<Animated.View
				className="absolute top-0 bottom-0 left-0 w-[300px] bg-card"
				entering={SlideInLeft}
				exiting={SlideOutLeft}
			>
				<View
					className="flex-row items-center gap-3 px-4 pb-4"
					style={{ paddingTop: insets.top + 12 }}
				>
					{user?.imageUrl ? (
						<Image
							accessibilityLabel={`${fullName} profile photo`}
							contentFit="cover"
							source={{ uri: user.imageUrl }}
							style={{ width: 48, height: 48, borderRadius: 24 }}
						/>
					) : (
						<Avatar name={fullName} size="lg" />
					)}
					<View className="flex-1 gap-0.5">
						<Text
							className="font-sans-semibold text-base text-foreground"
							numberOfLines={1}
						>
							{fullName}
						</Text>
						<Text
							className="font-sans text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{email}
						</Text>
					</View>
					<Pressable
						accessibilityLabel="Sign out"
						accessibilityRole="button"
						className="h-10 w-10 items-center justify-center rounded-lg"
						hitSlop={4}
						onPress={handleSignOut}
					>
						<LogOut color={colors.destructive} size={20} strokeWidth={2} />
					</Pressable>
				</View>

				<View className="border-border border-b" />

				<ScrollView className="flex-1" contentContainerClassName="p-4">
					<Pressable
						accessibilityLabel="Budgets"
						accessibilityRole="button"
						className="h-12 flex-row items-center gap-3 rounded-lg px-3 active:bg-muted"
						onPress={() => {
							onClose();
							router.push('/(app)/budgets');
						}}
					>
						<Wallet color={colors.foreground} size={20} strokeWidth={2} />
						<Text className="font-sans-medium text-base text-foreground">
							Budgets
						</Text>
					</Pressable>
					<Pressable
						accessibilityLabel="Documents"
						accessibilityRole="button"
						className="h-12 flex-row items-center gap-3 rounded-lg px-3 active:bg-muted"
						onPress={() => {
							onClose();
							router.push('/(app)/documents');
						}}
					>
						<FileText color={colors.foreground} size={20} strokeWidth={2} />
						<Text className="font-sans-medium text-base text-foreground">
							Documents
						</Text>
					</Pressable>
					{canViewUsers ? (
						<Pressable
							accessibilityLabel="Users"
							accessibilityRole="button"
							className="h-12 flex-row items-center gap-3 rounded-lg px-3 active:bg-muted"
							onPress={() => {
								onClose();
								router.push('/(app)/users');
							}}
						>
							<Users color={colors.foreground} size={20} strokeWidth={2} />
							<Text className="font-sans-medium text-base text-foreground">
								Users
							</Text>
						</Pressable>
					) : null}
				</ScrollView>

				<View className="border-border border-t" />

				<View
					className="px-4 pt-3"
					style={{ paddingBottom: insets.bottom + 12 }}
				>
					<Text className="font-sans text-muted-foreground text-xs">
						v{version}
					</Text>
				</View>
			</Animated.View>
		</View>
	);
}
