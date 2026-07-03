import { Text, View } from 'react-native';
import { type GroupTotals, MM_PER_METER } from '@/lib/takeoffs/math';

function TotalBadge({ label, value }: { label: string; value: string }) {
	return (
		<View className="flex-row items-center gap-1 rounded-md bg-muted px-1.5 py-0.5">
			<Text className="font-sans-bold text-[10px] text-muted-foreground">
				{label}
			</Text>
			<Text className="font-sans-medium text-foreground text-xs">{value}</Text>
		</View>
	);
}

/**
 * Per-family summary badges, mirroring the portal's GroupBadges:
 * AA/RA = actual/rounded area, AL/RL = actual/rounded linear,
 * WA = wall area, # = count.
 */
export function GroupBadges({ totals }: { totals: GroupTotals }) {
	return (
		<View className="flex-row flex-wrap gap-1.5">
			{totals.hasArea ? (
				<>
					<TotalBadge label="AA" value={`${totals.actualSqm.toFixed(2)} m²`} />
					<TotalBadge label="RA" value={`${totals.roundedSqm} m²`} />
				</>
			) : null}
			{totals.hasLinear ? (
				<>
					<TotalBadge
						label="AL"
						value={`${totals.actualMeters.toFixed(2)} m`}
					/>
					<TotalBadge
						label="RL"
						value={`${(totals.roundedLinearMm / MM_PER_METER).toFixed(2)} m`}
					/>
				</>
			) : null}
			{totals.hasHeight ? (
				<TotalBadge label="WA" value={`${totals.wallAreaSqm} m²`} />
			) : null}
			{totals.hasCount ? (
				<TotalBadge label="#" value={`${totals.totalCount}`} />
			) : null}
		</View>
	);
}
