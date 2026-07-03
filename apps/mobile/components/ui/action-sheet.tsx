import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { LucideIcon } from 'lucide-react-native';
import { forwardRef, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { cn } from '@/lib/cn';

export interface ActionSheetItem {
	destructive?: boolean;
	icon?: LucideIcon;
	key: string;
	label: string;
	onPress: () => void;
	selected?: boolean;
}

interface ActionSheetProps {
	items: ActionSheetItem[];
	onDismiss?: () => void;
	title?: string;
}

export const ActionSheet = forwardRef<BottomSheetModal, ActionSheetProps>(
	({ title, items, onDismiss }, ref) => {
		const colors = useThemeColors();
		const insets = useSafeAreaInsets();

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

		return (
			<BottomSheetModal
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.card }}
				enableDynamicSizing
				handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
				onDismiss={onDismiss}
				ref={ref}
			>
				<BottomSheetView
					className="px-4"
					style={{ paddingBottom: insets.bottom + 16 }}
				>
					{title ? (
						<Text className="px-2 pb-2 font-sans-semibold text-muted-foreground text-sm">
							{title}
						</Text>
					) : null}
					<View className="gap-1">
						{items.map((item) => {
							const Icon = item.icon;
							return (
								<Pressable
									accessibilityRole="button"
									className={cn(
										'min-h-[48px] flex-row items-center gap-3 rounded-lg px-3 active:bg-muted',
										item.selected && 'bg-muted'
									)}
									key={item.key}
									onPress={item.onPress}
								>
									{Icon ? (
										<Icon
											color={
												item.destructive
													? colors.destructive
													: colors.foreground
											}
											size={20}
											strokeWidth={2}
										/>
									) : null}
									<Text
										className={cn(
											'font-sans-medium text-base',
											item.destructive ? 'text-destructive' : 'text-foreground'
										)}
									>
										{item.label}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	}
);

ActionSheet.displayName = 'ActionSheet';
