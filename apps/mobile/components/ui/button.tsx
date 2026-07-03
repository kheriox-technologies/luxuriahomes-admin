import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

const containerStyles: Record<ButtonVariant, string> = {
	primary: 'bg-primary active:bg-accent',
	secondary: 'border border-border bg-card active:bg-muted',
	ghost: 'bg-transparent active:bg-muted',
	destructive: 'bg-destructive active:opacity-90',
};

const textStyles: Record<ButtonVariant, string> = {
	primary: 'text-primary-foreground',
	secondary: 'text-foreground',
	ghost: 'text-foreground',
	destructive: 'text-white',
};

// Raw spinner colors matching each variant's foreground (ActivityIndicator
// needs a color value, not a class). Ink on light fills, white on destructive.
const spinnerColors: Record<ButtonVariant, string> = {
	primary: '#2b2927',
	secondary: '#2b2927',
	ghost: '#2b2927',
	destructive: '#ffffff',
};

export function Button({
	children,
	onPress,
	variant = 'primary',
	loading = false,
	disabled = false,
	className,
	icon,
}: {
	children: ReactNode;
	onPress?: () => void;
	variant?: ButtonVariant;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	icon?: ReactNode;
}) {
	const isDisabled = disabled || loading;
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: isDisabled }}
			className={cn(
				'min-h-[48px] flex-row items-center justify-center gap-2 rounded-lg px-5',
				containerStyles[variant],
				isDisabled && 'opacity-50',
				className
			)}
			disabled={isDisabled}
			onPress={onPress}
		>
			{loading ? (
				<ActivityIndicator color={spinnerColors[variant]} size="small" />
			) : (
				icon
			)}
			<Text className={cn('font-sans-semibold text-base', textStyles[variant])}>
				{children}
			</Text>
		</Pressable>
	);
}
