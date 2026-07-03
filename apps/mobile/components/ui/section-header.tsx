import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export function SectionHeader({
	title,
	className,
}: {
	title: string;
	className?: string;
}) {
	return (
		<View className={cn('px-4 pt-5 pb-2', className)}>
			<Text className="font-sans-semibold text-muted-foreground text-xs uppercase tracking-wider">
				{title}
			</Text>
		</View>
	);
}

export function Separator({ className }: { className?: string }) {
	return <View className={cn('h-px bg-border', className)} />;
}
