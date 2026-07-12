import { ChevronDown } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import { OrderCard } from './order-card';
import type { OrderGroup } from './types';

// Green when the Xero actual is within budget, red when over, neutral with no
// budget set — mirrors the Budgets tab colour logic.
function actualBadgeVariant(
	actual: number,
	budgetPrice: number | null
): 'success' | 'destructive' | 'default' {
	if (budgetPrice === null) {
		return 'default';
	}
	return actual <= budgetPrice ? 'success' : 'destructive';
}

export const OrderTradeAccordion = memo(function OrderTradeAccordion({
	group,
	expanded,
	onToggle,
}: {
	group: OrderGroup;
	expanded: boolean;
	onToggle: () => void;
}) {
	const colors = useThemeColors();
	const hasBudget = group.budgetPrice !== null;

	return (
		<Animated.View layout={LinearTransition.duration(200)}>
			<Card className="mx-4 mb-2 overflow-hidden">
				<Pressable
					accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} trade ${group.tradeName}`}
					accessibilityRole="button"
					accessibilityState={{ expanded }}
					className="gap-1.5 p-3.5 active:bg-muted/50"
					onPress={onToggle}
				>
					<View className="flex-row items-center gap-2">
						<Text className="flex-1 font-sans-semibold text-foreground text-sm">
							{group.tradeName}
						</Text>
						<Badge variant="outline">{String(group.orders.length)}</Badge>
						<View className={cn('rotate-0', expanded && 'rotate-180')}>
							<ChevronDown
								color={colors.mutedForeground}
								size={18}
								strokeWidth={2}
							/>
						</View>
					</View>
					<View className="flex-row flex-wrap items-center gap-1.5">
						{hasBudget ? (
							<Badge variant="purple">
								B {formatCurrency(group.budgetPrice ?? 0)}
							</Badge>
						) : (
							<Badge variant="outline">No budget</Badge>
						)}
						{group.xeroActual === null ? null : (
							<Badge
								variant={actualBadgeVariant(
									group.xeroActual,
									group.budgetPrice
								)}
							>
								A {formatCurrency(group.xeroActual)}
							</Badge>
						)}
					</View>
				</Pressable>

				{expanded ? (
					<View className="pb-1.5">
						{group.orders.map((order) => (
							<OrderCard key={order._id} order={order} />
						))}
					</View>
				) : null}
			</Card>
		</Animated.View>
	);
});
