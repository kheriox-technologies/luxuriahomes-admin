import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export type BadgeVariant =
	| 'default'
	| 'success'
	| 'warning'
	| 'info'
	| 'destructive'
	| 'purple'
	| 'yellow'
	| 'gold'
	| 'outline';

const containerStyles: Record<BadgeVariant, string> = {
	default: 'bg-muted',
	success: 'bg-success/15',
	warning: 'bg-warning/15',
	info: 'bg-info/15',
	destructive: 'bg-destructive/15',
	purple: 'bg-violet-100 dark:bg-violet-900/40',
	yellow: 'bg-yellow-100 dark:bg-yellow-900/40',
	gold: 'bg-linen/25',
	outline: 'border border-border bg-transparent',
};

const textStyles: Record<BadgeVariant, string> = {
	default: 'text-muted-foreground',
	success: 'text-success',
	warning: 'text-warning',
	info: 'text-info',
	destructive: 'text-destructive',
	purple: 'text-violet-800 dark:text-violet-200',
	yellow: 'text-yellow-800 dark:text-yellow-200',
	gold: 'text-[#8a6d00] dark:text-linen',
	outline: 'text-muted-foreground',
};

export function Badge({
	children,
	variant = 'default',
	className,
}: {
	children: ReactNode;
	variant?: BadgeVariant;
	className?: string;
}) {
	return (
		<View
			className={cn(
				'flex-row items-center self-start rounded-full px-2.5 py-1',
				containerStyles[variant],
				className
			)}
		>
			<Text className={cn('font-sans-medium text-xs', textStyles[variant])}>
				{children}
			</Text>
		</View>
	);
}
