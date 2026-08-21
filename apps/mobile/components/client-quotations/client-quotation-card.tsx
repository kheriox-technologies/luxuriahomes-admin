import { MoreVertical, StickyNote } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { ClientQuotationStatusPill } from '@/components/ui/status-pill';
import { formatCurrency, formatDate } from '@/lib/format';
import type { ClientQuotationRow } from './types';

/**
 * One quotation in the list.
 *
 * The portal lays these out as a seven-column table, which does not survive a
 * phone — so the same fields stack: reference, version and status on top, then
 * the project, its clients, the total and the issue date.
 */
export const ClientQuotationCard = memo(
	({
		onOpenMenu,
		onOpenNotes,
		onPress,
		row,
	}: {
		onOpenMenu: (row: ClientQuotationRow) => void;
		onOpenNotes: (row: ClientQuotationRow) => void;
		onPress: (row: ClientQuotationRow) => void;
		row: ClientQuotationRow;
	}) => {
		const colors = useThemeColors();
		const clientNames = row.clients.map((client) => client.name).join(', ');

		return (
			<PressableCard
				accessibilityLabel={`Open quotation ${row.reference}`}
				className="mx-4 mb-3 gap-2 p-4"
				onPress={() => onPress(row)}
			>
				<View className="flex-row items-center gap-2">
					<Text className="font-sans-semibold text-foreground text-sm tabular-nums">
						{row.reference}
					</Text>
					{row.version && row.version > 1 ? (
						<Badge variant="outline">{`v${row.version}`}</Badge>
					) : null}
					<View className="flex-1" />
					<ClientQuotationStatusPill status={row.status} />
					{row.noteCount > 0 ? (
						<Pressable
							accessibilityLabel={`Notes for ${row.reference}`}
							accessibilityRole="button"
							hitSlop={8}
							onPress={() => onOpenNotes(row)}
						>
							<StickyNote
								color={colors.mutedForeground}
								size={16}
								strokeWidth={2}
							/>
						</Pressable>
					) : null}
					<Pressable
						accessibilityLabel={`Actions for ${row.reference}`}
						accessibilityRole="button"
						hitSlop={8}
						onPress={() => onOpenMenu(row)}
					>
						<MoreVertical
							color={colors.mutedForeground}
							size={18}
							strokeWidth={2}
						/>
					</Pressable>
				</View>

				<Text
					className="font-sans-medium text-base text-foreground"
					numberOfLines={1}
				>
					{row.projectName}
				</Text>
				{clientNames ? (
					<Text
						className="font-sans text-muted-foreground text-xs"
						numberOfLines={1}
					>
						{clientNames}
					</Text>
				) : null}

				<View className="flex-row items-center gap-2">
					<Badge variant="purple">{formatCurrency(row.totalInclGst)}</Badge>
					<View className="flex-1" />
					<Text className="font-sans text-muted-foreground text-xs">
						{formatDate(row.issuedAt)}
					</Text>
				</View>
			</PressableCard>
		);
	}
);

ClientQuotationCard.displayName = 'ClientQuotationCard';
