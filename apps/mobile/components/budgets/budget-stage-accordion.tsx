import type { Id } from '@workspace/backend/dataModel';
import { ChevronDown, MoreVertical } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
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
	// Present when the trade has a budget row on this project; null when it's only
	// shown for a Xero actual. Needed for the per-trade delete (remove budget).
	projectBudgetId: Id<'projectBudgets'> | null;
	stageId: Id<'tradeStages'> | null;
	tradeDescription: string | null;
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
	isFirst,
	editing,
	nameDraft,
	priceDraft,
	onChangeName,
	onChangePrice,
	onOpenMenu,
}: {
	trade: BudgetTrade;
	xeroLabelsById: Map<string, XeroAccountLabel>;
	isFirst: boolean;
	editing: boolean;
	nameDraft: string;
	priceDraft: string;
	onChangeName: (tradeId: Id<'trades'>, value: string) => void;
	onChangePrice: (tradeId: Id<'trades'>, value: string) => void;
	onOpenMenu: (trade: BudgetTrade) => void;
}) {
	const colors = useThemeColors();

	// Rows after the first get a top divider so trades in a stage are separated.
	const rowClass = cn(
		'flex-row items-center gap-2 px-3.5 py-2.5',
		!isFirst && 'border-border border-t'
	);

	if (editing) {
		return (
			<View className={rowClass}>
				<TextInput
					className="h-9 flex-1 rounded-lg border border-border bg-background px-3 font-sans text-foreground text-sm"
					onChangeText={(value) => onChangeName(trade.tradeId, value)}
					placeholder="Trade name"
					placeholderTextColor={colors.mutedForeground}
					value={nameDraft}
				/>
				<View className="h-9 w-28 flex-row items-center gap-1 rounded-lg border border-border bg-background px-2.5">
					<Text className="font-sans text-muted-foreground text-sm">$</Text>
					<TextInput
						className="flex-1 font-sans text-foreground text-sm"
						keyboardType="decimal-pad"
						onChangeText={(value) => onChangePrice(trade.tradeId, value)}
						placeholder="0.00"
						placeholderTextColor={colors.mutedForeground}
						value={priceDraft}
					/>
				</View>
			</View>
		);
	}

	return (
		<View className={rowClass}>
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
			<Pressable
				accessibilityLabel={`Actions for ${trade.tradeName}`}
				accessibilityRole="button"
				hitSlop={8}
				onPress={() => onOpenMenu(trade)}
			>
				<MoreVertical
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
			</Pressable>
		</View>
	);
}

export const BudgetStageAccordion = memo(function BudgetStageAccordion({
	group,
	expanded,
	onToggle,
	xeroLabelsById,
	editing,
	nameDrafts,
	priceDrafts,
	onChangeName,
	onChangePrice,
	onOpenTradeMenu,
}: {
	group: BudgetStageGroup;
	expanded: boolean;
	onToggle: () => void;
	xeroLabelsById: Map<string, XeroAccountLabel>;
	editing: boolean;
	nameDrafts: Record<string, string>;
	priceDrafts: Record<string, string>;
	onChangeName: (tradeId: Id<'trades'>, value: string) => void;
	onChangePrice: (tradeId: Id<'trades'>, value: string) => void;
	onOpenTradeMenu: (trade: BudgetTrade) => void;
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
						{group.trades.map((trade, index) => (
							<TradeRow
								editing={editing}
								isFirst={index === 0}
								key={trade.tradeId}
								nameDraft={nameDrafts[trade.tradeId] ?? trade.tradeName}
								onChangeName={onChangeName}
								onChangePrice={onChangePrice}
								onOpenMenu={onOpenTradeMenu}
								priceDraft={
									priceDrafts[trade.tradeId] ??
									(trade.budgetPrice === null ? '' : String(trade.budgetPrice))
								}
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
