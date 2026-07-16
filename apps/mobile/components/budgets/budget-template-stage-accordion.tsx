import type { Id } from '@workspace/backend/dataModel';
import { Check, ChevronDown, MoreVertical } from 'lucide-react-native';
import { memo } from 'react';
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';

export interface BudgetTemplateTrade {
	budgetTemplateItemId: Id<'budgetTemplateItems'>;
	price: number;
	stageId: Id<'tradeStages'> | null;
	tradeDescription: string | null;
	tradeId: Id<'trades'>;
	tradeName: string;
}

export interface BudgetTemplateStageGroup {
	key: string;
	name: string;
	subtotal: number;
	trades: BudgetTemplateTrade[];
}

function TradeRow({
	trade,
	isFirst,
	editing,
	rowEditing,
	saving,
	nameDraft,
	priceDraft,
	onChangeName,
	onChangePrice,
	onOpenMenu,
	onSaveRow,
}: {
	trade: BudgetTemplateTrade;
	isFirst: boolean;
	editing: boolean;
	rowEditing: boolean;
	saving: boolean;
	nameDraft: string;
	priceDraft: string;
	onChangeName: (tradeId: Id<'trades'>, value: string) => void;
	onChangePrice: (tradeId: Id<'trades'>, value: string) => void;
	onOpenMenu: (trade: BudgetTemplateTrade) => void;
	onSaveRow: (trade: BudgetTemplateTrade) => void;
}) {
	const colors = useThemeColors();

	// Rows after the first get a top divider so trades in a stage are separated.
	const rowClass = cn(
		'flex-row items-center gap-2 px-3.5 py-2.5',
		!isFirst && 'border-border border-t'
	);

	if (editing || rowEditing) {
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
				{rowEditing ? (
					<Pressable
						accessibilityLabel={`Save ${trade.tradeName}`}
						accessibilityRole="button"
						disabled={saving}
						hitSlop={8}
						onPress={() => onSaveRow(trade)}
					>
						{saving ? (
							<ActivityIndicator color={colors.foreground} size="small" />
						) : (
							<Check color={colors.foreground} size={18} strokeWidth={2} />
						)}
					</Pressable>
				) : null}
			</View>
		);
	}

	return (
		<View className={rowClass}>
			<Text className="flex-1 font-sans text-foreground text-sm">
				{trade.tradeName}
			</Text>
			<Badge variant="purple">{formatCurrency(trade.price)}</Badge>
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

export const BudgetTemplateStageAccordion = memo(
	function BudgetTemplateStageAccordion({
		group,
		expanded,
		onToggle,
		editing,
		editingRowIds,
		savingTradeId,
		nameDrafts,
		priceDrafts,
		onChangeName,
		onChangePrice,
		onOpenTradeMenu,
		onSaveRow,
	}: {
		group: BudgetTemplateStageGroup;
		expanded: boolean;
		onToggle: () => void;
		editing: boolean;
		editingRowIds: Set<string>;
		savingTradeId: string | null;
		nameDrafts: Record<string, string>;
		priceDrafts: Record<string, string>;
		onChangeName: (tradeId: Id<'trades'>, value: string) => void;
		onChangePrice: (tradeId: Id<'trades'>, value: string) => void;
		onOpenTradeMenu: (trade: BudgetTemplateTrade) => void;
		onSaveRow: (trade: BudgetTemplateTrade) => void;
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
							{group.trades.map((trade, index) => (
								<TradeRow
									editing={editing}
									isFirst={index === 0}
									key={trade.tradeId}
									nameDraft={nameDrafts[trade.tradeId] ?? trade.tradeName}
									onChangeName={onChangeName}
									onChangePrice={onChangePrice}
									onOpenMenu={onOpenTradeMenu}
									onSaveRow={onSaveRow}
									priceDraft={priceDrafts[trade.tradeId] ?? String(trade.price)}
									rowEditing={editingRowIds.has(trade.tradeId)}
									saving={savingTradeId === trade.tradeId}
									trade={trade}
								/>
							))}
						</View>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);
