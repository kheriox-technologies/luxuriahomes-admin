import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/format';

export function Avatar({
	name,
	size = 'md',
	className,
}: {
	name: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}) {
	const sizeStyles = {
		sm: 'h-8 w-8',
		md: 'h-10 w-10',
		lg: 'h-14 w-14',
	}[size];
	const textSize = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-lg',
	}[size];

	return (
		<View
			className={cn(
				'items-center justify-center rounded-full bg-primary',
				sizeStyles,
				className
			)}
		>
			<Text
				className={cn('font-sans-semibold text-primary-foreground', textSize)}
			>
				{getInitials(name)}
			</Text>
		</View>
	);
}
