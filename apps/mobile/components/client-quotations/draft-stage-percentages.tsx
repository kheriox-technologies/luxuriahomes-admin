import { Text, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import {
	PERCENT_EPSILON,
	REQUIRED_PERCENT_TOTAL,
} from '@/lib/client-quotation-form';
import { formatCurrency } from '@/lib/format';
import { CONTROL_HEIGHT } from '@/lib/theme';

export interface StagePercentRow {
	amount: number;
	key: string;
	name: string;
	percent: string;
}

/**
 * How the contract sum is claimed across the stages.
 *
 * The set has to total exactly 100 — the server rejects anything else — so the
 * total line is the control that matters here and turns destructive until it
 * balances.
 */
export function DraftStagePercentages({
	onPercentChange,
	percentTotal,
	rows,
	totalAmount,
	valid,
}: {
	onPercentChange: (key: string, percent: string) => void;
	percentTotal: number;
	rows: StagePercentRow[];
	totalAmount: number;
	valid: boolean;
}) {
	return (
		<View className="gap-2">
			{rows.length === 0 ? (
				<Text className="font-sans text-muted-foreground text-xs">
					This template has no stages, so there is nothing to schedule.
				</Text>
			) : null}

			{rows.map((row) => (
				<View className="flex-row items-center gap-2" key={row.key}>
					<Text
						className="flex-1 font-sans text-foreground text-sm"
						numberOfLines={1}
					>
						{row.name}
					</Text>
					<View
						className="w-20 flex-row items-center gap-1 rounded-lg border border-border bg-card px-3"
						style={{ height: CONTROL_HEIGHT }}
					>
						<CenteredTextInput
							keyboardType="decimal-pad"
							onChangeText={(percent) => onPercentChange(row.key, percent)}
							placeholder="0"
							value={row.percent}
						/>
						<Text className="font-sans text-muted-foreground text-sm">%</Text>
					</View>
					<Text className="w-24 text-right font-sans text-muted-foreground text-xs tabular-nums">
						{formatCurrency(row.amount)}
					</Text>
				</View>
			))}

			{rows.length > 0 ? (
				<View className="flex-row items-center gap-2 border-border border-t pt-2">
					<Text className="flex-1 font-sans-medium text-foreground text-sm">
						Total
					</Text>
					<Badge variant={valid ? 'success' : 'destructive'}>
						{`${percentTotal}%`}
					</Badge>
					<Text className="w-24 text-right font-sans-medium text-foreground text-xs tabular-nums">
						{formatCurrency(totalAmount)}
					</Text>
				</View>
			) : null}

			{valid || rows.length === 0 ? null : (
				<Text className="font-sans text-destructive text-xs">
					{`The stages must total ${REQUIRED_PERCENT_TOTAL}% (within ${PERCENT_EPSILON}%) before the quotation can be saved.`}
				</Text>
			)}
		</View>
	);
}
