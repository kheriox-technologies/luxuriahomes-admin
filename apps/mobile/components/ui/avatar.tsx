import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/format';

export function Avatar({
	name,
	size = 'md',
	variant = 'solid',
	className,
}: {
	name: string;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'solid' | 'outline';
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
	const isOutline = variant === 'outline';

	return (
		<View
			className={cn(
				'items-center justify-center rounded-full',
				isOutline ? 'border border-primary bg-transparent' : 'bg-primary',
				sizeStyles,
				className
			)}
		>
			<Text
				className={cn(
					'font-sans-semibold',
					isOutline ? 'text-primary' : 'text-primary-foreground',
					textSize
				)}
			>
				{getInitials(name)}
			</Text>
		</View>
	);
}
