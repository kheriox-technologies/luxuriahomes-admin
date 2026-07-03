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
			{loading ? <ActivityIndicator color="#fff0a9" size="small" /> : icon}
			<Text className={cn('font-sans-semibold text-base', textStyles[variant])}>
				{children}
			</Text>
		</Pressable>
	);
}
