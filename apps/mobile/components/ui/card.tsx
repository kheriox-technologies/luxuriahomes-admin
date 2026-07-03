import type { ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import { cn } from '@/lib/cn';

export function Card({
	className,
	...props
}: ViewProps & { className?: string }) {
	return (
		<View
			className={cn('rounded-xl border border-border bg-card', className)}
			{...props}
		/>
	);
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_SCALE = 0.98;

export function PressableCard({
	children,
	className,
	onPress,
	accessibilityLabel,
	disabled,
}: {
	children: ReactNode;
	className?: string;
	onPress?: () => void;
	accessibilityLabel?: string;
	disabled?: boolean;
}) {
	const scale = useSharedValue(1);
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<AnimatedPressable
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="button"
			className={cn('rounded-xl border border-border bg-card', className)}
			disabled={disabled}
			onPress={onPress}
			onPressIn={() => {
				scale.value = withSpring(PRESS_SCALE, { damping: 20, stiffness: 300 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 20, stiffness: 300 });
			}}
			style={animatedStyle}
		>
			{children}
		</AnimatedPressable>
	);
}
