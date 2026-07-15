import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import {
	EllipsisVertical,
	ImageOff,
	Pencil,
	Plus,
	Trash2,
} from 'lucide-react-native';
import { memo, type ReactNode, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { classVariants } from '@/components/inclusions/types';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatSignedCurrency } from '@/lib/format';
import { useSignedUrl } from '@/lib/use-signed-url';

type Inclusion = Doc<'inclusions'>;
type InclusionVariant = Doc<'inclusionVariants'>;

function computeVariation(
	variant: InclusionVariant,
	inclusion: Inclusion
): number {
	if (variant.class === 'Standard' || inclusion.standardPrice === undefined) {
		return 0;
	}
	const saleDelta = variant.salePrice - inclusion.standardPrice;
	const labourDelta =
		(variant.labourPrice ?? 0) - (inclusion.standardLabourPrice ?? 0);
	return saleDelta + labourDelta;
}

function VariantThumbnail({ image }: { image?: string }) {
	const colors = useThemeColors();
	const { uri, failed } = useSignedUrl(image);
	const [lightbox, setLightbox] = useState(false);
	const showImage = Boolean(image) && !failed;

	let content: ReactNode;
	if (!showImage) {
		content = (
			<ImageOff color={colors.mutedForeground} size={22} strokeWidth={1.75} />
		);
	} else if (uri) {
		content = (
			<Image
				cachePolicy="memory-disk"
				contentFit="cover"
				source={{ uri }}
				style={{ width: '100%', height: '100%' }}
			/>
		);
	} else {
		content = <Skeleton className="h-full w-full" />;
	}

	return (
		<>
			<Pressable
				accessibilityLabel={showImage ? 'View variant image' : undefined}
				accessibilityRole={showImage ? 'imagebutton' : 'image'}
				className="h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-muted"
				disabled={!uri}
				onPress={() => setLightbox(true)}
			>
				{content}
			</Pressable>
			<ImageLightbox
				onClose={() => setLightbox(false)}
				uri={uri}
				visible={lightbox}
			/>
		</>
	);
}

export const CatalogueVariantCard = memo(function CatalogueVariantCard({
	variant,
	inclusion,
	onAddToProject,
	onEdit,
}: {
	variant: InclusionVariant;
	inclusion: Inclusion;
	onAddToProject: (variant: InclusionVariant) => void;
	onEdit: (variant: InclusionVariant) => void;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);
	const removeVariant = useMutation(api.inclusionVariants.remove.remove);
	const variation = computeVariation(variant, inclusion);

	const confirmDelete = () => {
		Alert.alert(
			'Delete variant',
			`Delete variant "${variant.code}"? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeVariant({ variantId: variant._id }).catch(() => {
							Alert.alert('Could not delete variant', 'Please try again.');
						});
					},
				},
			]
		);
	};
	const modelsSuffix =
		variant.models.length > 0 ? ` · ${variant.models.join(', ')}` : '';

	return (
		<Card className="mx-4 mb-2 flex-row gap-3 p-3">
			<VariantThumbnail image={variant.image} />
			<View className="flex-1 gap-1">
				<View className="flex-row items-start gap-1">
					<Text className="flex-1 font-sans-semibold text-foreground text-sm">
						{variant.code}
					</Text>
					<Pressable
						accessibilityLabel="Variant actions"
						accessibilityRole="button"
						className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
						hitSlop={6}
						onPress={() => sheetRef.current?.present()}
					>
						<EllipsisVertical
							color={colors.mutedForeground}
							size={18}
							strokeWidth={2}
						/>
					</Pressable>
				</View>
				<Text
					className="font-sans text-muted-foreground text-xs"
					numberOfLines={1}
				>
					{variant.vendor}
					{modelsSuffix}
				</Text>
				{variant.color ? (
					<Text className="font-sans text-muted-foreground text-xs">
						{variant.color}
					</Text>
				) : null}
				{variant.details ? (
					<Text
						className="font-sans text-muted-foreground text-xs"
						numberOfLines={2}
					>
						{variant.details}
					</Text>
				) : null}
				<View className="flex-row flex-wrap items-center gap-1.5 pt-0.5">
					<Badge variant={classVariants[variant.class] ?? 'default'}>
						{variant.class}
					</Badge>
					<Badge variant="outline">
						Cost {formatCurrency(variant.costPrice)}
					</Badge>
					<Badge variant="purple">
						Sale {formatCurrency(variant.salePrice)}
					</Badge>
					{variant.labourPrice !== undefined ? (
						<Badge variant="gold">
							Labour {formatCurrency(variant.labourPrice)}
						</Badge>
					) : null}
					{variation !== 0 ? (
						<Badge variant="info">
							Variation {formatSignedCurrency(variation)}
						</Badge>
					) : null}
				</View>
			</View>
			<ActionSheet
				items={[
					{
						key: 'add',
						label: 'Add to project',
						icon: Plus,
						onPress: () => {
							sheetRef.current?.dismiss();
							onAddToProject(variant);
						},
					},
					{
						key: 'edit',
						label: 'Edit variant',
						icon: Pencil,
						onPress: () => {
							sheetRef.current?.dismiss();
							onEdit(variant);
						},
					},
					{
						key: 'delete',
						label: 'Delete variant',
						icon: Trash2,
						destructive: true,
						onPress: () => {
							sheetRef.current?.dismiss();
							confirmDelete();
						},
					},
				]}
				ref={sheetRef}
				title={variant.code}
			/>
		</Card>
	);
});
