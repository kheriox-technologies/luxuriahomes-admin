import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
	const opacity = useSharedValue(0.5);

	useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withTiming(1, { duration: 700 }),
				withTiming(0.5, { duration: 700 })
			),
			-1
		);
	}, [opacity]);

	const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

	return (
		<Animated.View
			className={cn('rounded-lg bg-muted', className)}
			style={style}
		/>
	);
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
	const keys = Array.from({ length: rows }, (_, i) => `skeleton-${i}`);
	return (
		<View className="gap-3 p-4">
			{keys.map((key) => (
				<Skeleton className="h-24 w-full" key={key} />
			))}
		</View>
	);
}
