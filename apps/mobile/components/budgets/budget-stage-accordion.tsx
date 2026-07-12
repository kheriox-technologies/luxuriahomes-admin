import type { Id } from '@workspace/backend/dataModel';
import { ChevronDown } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { XeroAccountLabel } from '@/components/xero/use-xero-account-codes';
import { XeroAccountBadges } from '@/components/xero/xero-account-badges';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';

export interface BudgetTrade {
	actual: number | null;
	budgetPrice: number | null;
	tradeId: Id<'trades'>;
	tradeName: string;
	// Mapped Xero account GUIDs, for the code badges beside the trade name.
	xeroAccountIds: string[];
}

export interface BudgetStageGroup {
	actualSubtotal: number;
	budgetSubtotal: number;
	key: string;
	name: string;
	trades: BudgetTrade[];
}

// Green when spend is within budget, red when over; neutral when no budget set.
function actualVariant(
	actual: number | null,
	budgetPrice: number | null
): 'success' | 'destructive' | 'default' {
	if (actual === null || budgetPrice === null) {
		return 'default';
	}
	return actual <= budgetPrice ? 'success' : 'destructive';
}

function TradeRow({
	trade,
	xeroLabelsById,
}: {
	trade: BudgetTrade;
	xeroLabelsById: Map<string, XeroAccountLabel>;
}) {
	return (
		<View className="flex-row items-center gap-2 px-3.5 py-2.5">
			<View className="flex-1 gap-1">
				<Text className="font-sans text-foreground text-sm">
					{trade.tradeName}
				</Text>
				{trade.xeroAccountIds.length > 0 ? (
					<View className="flex-row flex-wrap gap-1">
						<XeroAccountBadges
							accountIds={trade.xeroAccountIds}
							labelsById={xeroLabelsById}
						/>
					</View>
				) : null}
			</View>
			{trade.budgetPrice ? (
				<Badge variant="purple">B {formatCurrency(trade.budgetPrice)}</Badge>
			) : null}
			{trade.actual ? (
				<Badge variant={actualVariant(trade.actual, trade.budgetPrice)}>
					A {formatCurrency(trade.actual)}
				</Badge>
			) : null}
		</View>
	);
}

export const BudgetStageAccordion = memo(function BudgetStageAccordion({
	group,
	expanded,
	onToggle,
	xeroLabelsById,
}: {
	group: BudgetStageGroup;
	expanded: boolean;
	onToggle: () => void;
	xeroLabelsById: Map<string, XeroAccountLabel>;
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
						<Badge variant="purple">
							B {formatCurrency(group.budgetSubtotal)}
						</Badge>
						<Badge
							variant={actualVariant(
								group.actualSubtotal,
								group.budgetSubtotal
							)}
						>
							A {formatCurrency(group.actualSubtotal)}
						</Badge>
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
							<TradeRow
								key={trade.tradeId}
								trade={trade}
								xeroLabelsById={xeroLabelsById}
							/>
						))}
					</View>
				) : null}
			</Card>
		</Animated.View>
	);
});
