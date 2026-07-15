import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Doc } from '@workspace/backend/dataModel';
import { useRouter } from 'expo-router';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react-native';
import { memo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

type Inclusion = Doc<'inclusions'>;

function variantLabel(count: number): string {
	return `${count} ${count === 1 ? 'Variant' : 'Variants'}`;
}

export const CatalogueInclusionCard = memo(function CatalogueInclusionCard({
	inclusion,
	onEdit,
	onDelete,
}: {
	inclusion: Inclusion;
	onEdit: (inclusion: Inclusion) => void;
	onDelete: (inclusion: Inclusion) => void;
}) {
	const colors = useThemeColors();
	const router = useRouter();
	const menuRef = useRef<BottomSheetModal>(null);

	return (
		<PressableCard
			accessibilityLabel={`Inclusion ${inclusion.title}`}
			className="mx-4 mb-2 flex-row items-start gap-2 p-3.5"
			onPress={() =>
				router.push({
					pathname: '/(app)/inclusions/[inclusionId]',
					params: { inclusionId: inclusion._id },
				})
			}
		>
			<View className="flex-1 gap-1.5">
				<Text className="font-sans-semibold text-foreground text-sm">
					{inclusion.title}
				</Text>
				<View className="flex-row flex-wrap items-center gap-1.5">
					{inclusion.variantCount > 0 ? (
						<Badge variant="info">{variantLabel(inclusion.variantCount)}</Badge>
					) : null}
					{inclusion.standardPrice !== undefined ? (
						<Badge variant="purple">
							Base {formatCurrency(inclusion.standardPrice)}
						</Badge>
					) : null}
					{inclusion.standardLabourPrice !== undefined ? (
						<Badge variant="gold">
							Labour {formatCurrency(inclusion.standardLabourPrice)}
						</Badge>
					) : null}
				</View>
			</View>
			<Pressable
				accessibilityLabel={`Inclusion ${inclusion.title} actions`}
				accessibilityRole="button"
				className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
				hitSlop={6}
				onPress={() => menuRef.current?.present()}
			>
				<EllipsisVertical
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
			</Pressable>
			<ActionSheet
				items={[
					{
						key: 'edit',
						label: 'Edit inclusion',
						icon: Pencil,
						onPress: () => {
							menuRef.current?.dismiss();
							onEdit(inclusion);
						},
					},
					{
						key: 'delete',
						label: 'Delete inclusion',
						icon: Trash2,
						destructive: true,
						onPress: () => {
							menuRef.current?.dismiss();
							onDelete(inclusion);
						},
					},
				]}
				ref={menuRef}
				title={inclusion.title}
			/>
		</PressableCard>
	);
});
