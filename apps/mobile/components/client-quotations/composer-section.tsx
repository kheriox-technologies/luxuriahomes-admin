import { ChevronDown, ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Card } from '@/components/ui/card';

/**
 * One collapsible block of the composer.
 *
 * The portal lays the ten sections out as cards down a single long page. On a
 * phone that is far too much scrolling, so each collapses — the header keeps the
 * section's headline figure visible while it is closed, which is what makes a
 * collapsed section still worth reading.
 */
export function ComposerSection({
	children,
	invalid = false,
	onToggle,
	open,
	rightSlot,
	subtitle,
	title,
}: {
	children: ReactNode;
	invalid?: boolean;
	onToggle: () => void;
	open: boolean;
	rightSlot?: ReactNode;
	subtitle?: string;
	title: string;
}) {
	const colors = useThemeColors();

	return (
		<Animated.View layout={LinearTransition}>
			<Card
				className={
					invalid ? 'overflow-hidden border-destructive' : 'overflow-hidden'
				}
			>
				<View className="flex-row items-center gap-2 p-3.5">
					<Pressable
						accessibilityLabel={open ? `Collapse ${title}` : `Expand ${title}`}
						accessibilityRole="button"
						className="flex-1 flex-row items-center gap-2"
						hitSlop={8}
						onPress={onToggle}
					>
						{open ? (
							<ChevronDown
								color={colors.mutedForeground}
								size={16}
								strokeWidth={2}
							/>
						) : (
							<ChevronRight
								color={colors.mutedForeground}
								size={16}
								strokeWidth={2}
							/>
						)}
						<View className="flex-1">
							<Text className="font-sans-semibold text-foreground text-sm">
								{title}
							</Text>
							{subtitle ? (
								<Text
									className="font-sans text-muted-foreground text-xs"
									numberOfLines={1}
								>
									{subtitle}
								</Text>
							) : null}
						</View>
					</Pressable>
					{rightSlot}
				</View>
				{open ? (
					<View className="gap-3 border-border border-t p-3.5">{children}</View>
				) : null}
			</Card>
		</Animated.View>
	);
}
