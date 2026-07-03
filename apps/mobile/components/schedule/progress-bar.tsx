import { View } from 'react-native';
import { cn } from '@/lib/cn';

export function ProgressBar({
	completed,
	total,
	className,
}: {
	completed: number;
	total: number;
	className?: string;
}) {
	const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
	return (
		<View
			className={cn('h-1.5 overflow-hidden rounded-full bg-muted', className)}
		>
			<View
				className={cn(
					'h-full rounded-full',
					pct === 100 ? 'bg-success' : 'bg-info'
				)}
				style={{ width: `${pct}%` }}
			/>
		</View>
	);
}
