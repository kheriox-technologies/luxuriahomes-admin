import { ChevronDown } from 'lucide-react-native';
import { memo, type RefObject } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import { QuotationCard } from './quotation-card';
import type { QuotationNotesSheetHandle } from './quotation-notes-sheet';
import type { QuotationGroup } from './types';

export const QuotationTradeAccordion = memo(function QuotationTradeAccordion({
	group,
	expanded,
	onToggle,
	notesSheetRef,
}: {
	group: QuotationGroup;
	expanded: boolean;
	onToggle: () => void;
	notesSheetRef: RefObject<QuotationNotesSheetHandle | null>;
}) {
	const colors = useThemeColors();
	const hasBudget = group.budgetPrice !== null;
	const remaining = group.remaining ?? 0;

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
						<Badge variant="outline">{String(group.quotations.length)}</Badge>
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
							<>
								<Badge variant="purple">
									Budget {formatCurrency(group.budgetPrice ?? 0)}
								</Badge>
								<Badge variant={remaining >= 0 ? 'success' : 'destructive'}>
									Remaining {formatCurrency(remaining)}
								</Badge>
							</>
						) : (
							<Badge variant="outline">No budget</Badge>
						)}
					</View>
				</Pressable>

				{expanded ? (
					<View className="pb-1.5">
						{group.quotations.map((quotation) => (
							<QuotationCard
								key={quotation._id}
								notesSheetRef={notesSheetRef}
								quotation={quotation}
							/>
						))}
					</View>
				) : null}
			</Card>
		</Animated.View>
	);
});
