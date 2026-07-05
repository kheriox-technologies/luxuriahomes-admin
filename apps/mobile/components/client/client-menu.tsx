import { useClerk, useUser } from '@clerk/clerk-expo';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { LogOut } from 'lucide-react-native';
import { useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Avatar } from '@/components/ui/avatar';

// Profile/menu button for the client projects header. The client surface has no
// admin drawer, so the profile summary and sign-out live in this bottom sheet.
export function ClientMenu() {
	const sheetRef = useRef<BottomSheetModal>(null);
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const { user } = useUser();
	const { signOut } = useClerk();

	const fullName = user?.fullName ?? 'Account';
	const email = user?.primaryEmailAddress?.emailAddress ?? '';
	const version = Constants.expoConfig?.version ?? '1.0.0';

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const handleSignOut = () => {
		sheetRef.current?.dismiss();
		signOut();
	};

	return (
		<>
			<Pressable
				accessibilityLabel="Account menu"
				accessibilityRole="button"
				hitSlop={6}
				onPress={() => sheetRef.current?.present()}
			>
				<Avatar name={fullName} size="md" />
			</Pressable>
			<BottomSheetModal
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.card }}
				enableDynamicSizing
				handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
				ref={sheetRef}
			>
				<BottomSheetView
					className="px-4 pt-1"
					style={{ paddingBottom: insets.bottom + 16 }}
				>
					<View className="flex-row items-center gap-3 pb-4">
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
							{email ? (
								<Text
									className="font-sans text-muted-foreground text-sm"
									numberOfLines={1}
								>
									{email}
								</Text>
							) : null}
						</View>
					</View>

					<View className="border-border border-t" />

					<Pressable
						accessibilityLabel="Sign out"
						accessibilityRole="button"
						className="mt-2 min-h-[48px] flex-row items-center gap-3 rounded-lg px-3 active:bg-muted"
						onPress={handleSignOut}
					>
						<LogOut color={colors.destructive} size={20} strokeWidth={2} />
						<Text className="font-sans-medium text-base text-destructive">
							Sign out
						</Text>
					</Pressable>

					<Text className="px-3 pt-3 font-sans text-muted-foreground text-xs">
						v{version}
					</Text>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}
