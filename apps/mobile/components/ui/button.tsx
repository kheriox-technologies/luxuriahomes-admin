import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { cn } from '@/lib/cn';

type ButtonVariant =
	| 'outline'
	| 'primary'
	| 'secondary'
	| 'ghost'
	| 'destructive'
	| 'destructive-outline';

const containerStyles: Record<ButtonVariant, string> = {
	outline: 'border border-border bg-card active:bg-muted',
	primary: 'bg-primary active:bg-accent',
	secondary: 'border border-border bg-card active:bg-muted',
	ghost: 'bg-transparent active:bg-muted',
	destructive: 'bg-destructive active:opacity-90',
	'destructive-outline': 'border border-destructive bg-card active:bg-muted',
};

const textStyles: Record<ButtonVariant, string> = {
	outline: 'text-foreground',
	primary: 'text-primary-foreground',
	secondary: 'text-foreground',
	ghost: 'text-foreground',
	destructive: 'text-white',
	'destructive-outline': 'text-destructive',
};

// Raw spinner colors matching each variant's foreground (ActivityIndicator
// needs a color value, not a class). Ink on light fills, white on destructive.
const spinnerColors: Record<ButtonVariant, string> = {
	outline: '#2b2927',
	primary: '#2b2927',
	secondary: '#2b2927',
	ghost: '#2b2927',
	destructive: '#ffffff',
	'destructive-outline': '#df2225',
};

export function Button({
	children,
	onPress,
	variant = 'outline',
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
				'h-9 flex-row items-center justify-center gap-2 rounded-lg px-4',
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
			<Text className={cn('font-sans-medium text-sm', textStyles[variant])}>
				{children}
			</Text>
		</Pressable>
	);
}
