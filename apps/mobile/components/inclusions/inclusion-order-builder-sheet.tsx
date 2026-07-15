import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import type { PendingOrderItem } from './types';

export interface InclusionOrderBuilderSheetHandle {
	present: () => void;
}

function buildOrderItems(items: PendingOrderItem[]) {
	return items.map((item) => {
		const description =
			[item.details, item.color].filter(Boolean).join(', ') || undefined;
		return {
			name: item.title,
			description,
			quantity: item.totalQty > 0 ? item.totalQty : 1,
			unit: item.unit || 'unit',
			price: item.costPrice,
			sku: item.models.length > 0 ? item.models.join(', ') : undefined,
		};
	});
}

export function InclusionOrderBuilderSheet({
	projectId,
	items,
	onRemove,
	onCreated,
	ref,
}: {
	projectId: Id<'projects'>;
	items: PendingOrderItem[];
	onRemove: (inclusionId: Id<'projectInclusions'>) => void;
	onCreated: () => void;
	ref?: Ref<InclusionOrderBuilderSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [creatingOrder, setCreatingOrder] = useState(false);
	const addOrder = useMutation(api.projectOrders.add.add);

	const vendor = items[0]?.vendor ?? '';

	useImperativeHandle(ref, () => ({
		present: () => {
			sheetRef.current?.present();
		},
	}));

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const handleCreateOrder = async () => {
		if (items.length === 0) {
			return;
		}
		setCreatingOrder(true);
		try {
			const orderId = await addOrder({
				projectId,
				vendor,
				items: buildOrderItems(items),
				status: 'Pending',
				inclusionIds: items.map((item) => item.inclusionId),
			});
			sheetRef.current?.dismiss();
			onCreated();
			router.push({
				pathname: '/(app)/orders/[orderId]',
				params: { orderId },
			});
		} catch {
			Alert.alert('Unable to create order', 'Please try again.');
		} finally {
			setCreatingOrder(false);
		}
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={640}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-4 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text
					className="font-sans-semibold text-base text-foreground"
					numberOfLines={1}
				>
					New order{vendor ? ` · ${vendor}` : ''}
				</Text>

				<View className="gap-1.5">
					{items.map((item) => (
						<View
							className="flex-row items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
							key={item.inclusionId}
						>
							<View className="flex-1">
								<Text
									className="font-sans-medium text-foreground text-sm"
									numberOfLines={1}
								>
									{item.title}
								</Text>
								<Text className="font-sans text-muted-foreground text-xs">
									{item.totalQty > 0
										? `${item.totalQty}${item.unit ? ` ${item.unit}` : ''}`
										: 'Qty 1'}
								</Text>
							</View>
							<Pressable
								accessibilityLabel={`Remove ${item.title}`}
								accessibilityRole="button"
								hitSlop={8}
								onPress={() => onRemove(item.inclusionId)}
							>
								<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
							</Pressable>
						</View>
					))}
				</View>

				<Button
					disabled={items.length === 0 || creatingOrder}
					loading={creatingOrder}
					onPress={handleCreateOrder}
				>
					Create order
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
