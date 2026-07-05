import type { Id } from '@workspace/backend/dataModel';
import { ChevronDown } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';

export interface BudgetTemplateTrade {
	price: number;
	tradeId: Id<'trades'>;
	tradeName: string;
}

export interface BudgetTemplateStageGroup {
	key: string;
	name: string;
	subtotal: number;
	trades: BudgetTemplateTrade[];
}

function TradeRow({ trade }: { trade: BudgetTemplateTrade }) {
	return (
		<View className="flex-row items-center gap-2 px-3.5 py-2.5">
			<Text className="flex-1 font-sans text-foreground text-sm">
				{trade.tradeName}
			</Text>
			<Badge variant="purple">{formatCurrency(trade.price)}</Badge>
		</View>
	);
}

export const BudgetTemplateStageAccordion = memo(
	function BudgetTemplateStageAccordion({
		group,
		expanded,
		onToggle,
	}: {
		group: BudgetTemplateStageGroup;
		expanded: boolean;
		onToggle: () => void;
	}) {
		const colors = useThemeColors();

		return (
			<Animated.View layout={LinearTransition.duration(200)}>
				<Card className="mx-4 mb-2 overflow-hidden">
					<Pressable
						accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} stage ${group.name}`}
						accessibilityRole="button"
						accessibilityState={{ expanded }}
						className="gap-1.5 p-3.5 active:bg-muted/50"
						onPress={onToggle}
					>
						<View className="flex-row items-center gap-2">
							<Text className="flex-1 font-sans-semibold text-foreground text-sm">
								{group.name}
							</Text>
							<Badge variant="purple">{formatCurrency(group.subtotal)}</Badge>
							<View className={cn('rotate-0', expanded && 'rotate-180')}>
								<ChevronDown
									color={colors.mutedForeground}
									size={18}
									strokeWidth={2}
								/>
							</View>
						</View>
					</Pressable>

					{expanded ? (
						<View className="border-border border-t pb-1.5">
							{group.trades.map((trade) => (
								<TradeRow key={trade.tradeId} trade={trade} />
							))}
						</View>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);
