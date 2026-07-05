import type { Id } from '@workspace/backend/dataModel';
import { ChevronDown } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { ServiceProviderCard } from './service-provider-card';
import type { ServiceProviderGroup } from './types';

export const ServiceProviderTradeAccordion = memo(
	function ServiceProviderTradeAccordion({
		group,
		projectId,
		expanded,
		onToggle,
	}: {
		group: ServiceProviderGroup;
		projectId?: Id<'projects'>;
		expanded: boolean;
		onToggle: () => void;
	}) {
		const colors = useThemeColors();

		return (
			<Animated.View layout={LinearTransition.duration(200)}>
				<Card className="mx-4 mb-2 overflow-hidden">
					<Pressable
						accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} trade ${group.tradeName}`}
						accessibilityRole="button"
						accessibilityState={{ expanded }}
						className="flex-row items-center gap-2 p-3.5 active:bg-muted/50"
						onPress={onToggle}
					>
						<Text className="flex-1 font-sans-semibold text-foreground text-sm">
							{group.tradeName}
						</Text>
						<Badge variant="outline">{String(group.providers.length)}</Badge>
						<View className={cn('rotate-0', expanded && 'rotate-180')}>
							<ChevronDown
								color={colors.mutedForeground}
								size={18}
								strokeWidth={2}
							/>
						</View>
					</Pressable>

					{expanded ? (
						<View className="pb-1.5">
							{group.providers.map((provider) => (
								<ServiceProviderCard
									key={provider._id}
									projectId={projectId}
									provider={provider}
								/>
							))}
						</View>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);
