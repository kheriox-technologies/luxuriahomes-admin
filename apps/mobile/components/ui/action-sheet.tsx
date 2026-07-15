import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { LucideIcon } from 'lucide-react-native';
import { forwardRef, useCallback } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { cn } from '@/lib/cn';

export interface ActionSheetItem {
	destructive?: boolean;
	disabled?: boolean;
	icon?: LucideIcon;
	key: string;
	label: string;
	onPress: () => void;
	selected?: boolean;
}

function itemColor(
	item: ActionSheetItem,
	colors: ReturnType<typeof useThemeColors>
): string {
	if (item.disabled) {
		return colors.mutedForeground;
	}
	return item.destructive ? colors.destructive : colors.foreground;
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
		const { height } = useWindowDimensions();

		// Cap the sheet so a long list (e.g. Xero projects) scrolls instead of
		// growing behind the status bar / Dynamic Island.
		const maxDynamicContentSize = height - insets.top - insets.bottom - 48;

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
				maxDynamicContentSize={maxDynamicContentSize}
				onDismiss={onDismiss}
				ref={ref}
				// Stack on top of any parent sheet (e.g. a Select opened inside the
				// edit-quantities / order-builder sheets). The gorhom default of
				// 'switch' dismisses the parent, closing the whole form.
				stackBehavior="push"
				topInset={insets.top}
			>
				<BottomSheetScrollView
					contentContainerStyle={{
						paddingHorizontal: 16,
						paddingBottom: insets.bottom + 16,
					}}
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
									accessibilityState={{ disabled: item.disabled }}
									className={cn(
										'min-h-[48px] flex-row items-center gap-3 rounded-lg px-3',
										item.disabled ? 'opacity-40' : 'active:bg-muted',
										item.selected && 'bg-muted'
									)}
									disabled={item.disabled}
									key={item.key}
									onPress={item.onPress}
								>
									{Icon ? (
										<Icon
											color={itemColor(item, colors)}
											size={20}
											strokeWidth={2}
										/>
									) : null}
									<Text
										className={cn(
											'font-sans-medium text-xs',
											item.disabled && 'text-muted-foreground',
											!item.disabled &&
												(item.destructive
													? 'text-destructive'
													: 'text-foreground')
										)}
									>
										{item.label}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</BottomSheetScrollView>
			</BottomSheetModal>
		);
	}
);

ActionSheet.displayName = 'ActionSheet';
