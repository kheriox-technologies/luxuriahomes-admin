import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { OrderStatusPill } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/format';
import type { ProjectOrder } from './types';

type StatusHistory = Doc<'projectOrderStatusHistory'>;

export interface OrderStatusHistorySheetHandle {
	present: (order: ProjectOrder) => void;
}

export function OrderStatusHistorySheet({
	ref,
}: {
	ref?: Ref<OrderStatusHistorySheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const [order, setOrder] = useState<ProjectOrder | null>(null);

	const history = useQuery(
		api.projectOrders.listStatusHistory.listStatusHistory,
		order ? { orderId: order._id } : 'skip'
	) as StatusHistory[] | undefined;

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setOrder(next);
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

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={560}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-3 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text
					className="font-sans-semibold text-base text-foreground"
					numberOfLines={1}
				>
					Status history{order ? ` · ${order.orderId}` : ''}
				</Text>

				{history === undefined ? (
					<ActivityIndicator color={colors.mutedForeground} size="small" />
				) : null}
				{history?.length === 0 ? (
					<Text className="py-2 font-sans text-muted-foreground text-sm">
						No status changes yet.
					</Text>
				) : null}
				{history?.map((entry) => (
					<View
						className="gap-1.5 rounded-xl border border-border bg-background p-3"
						key={entry._id}
					>
						<View className="flex-row items-center justify-between gap-2">
							<OrderStatusPill status={entry.status} />
							<Text className="font-sans text-muted-foreground text-xs">
								{formatDate(entry.timestamp)}
							</Text>
						</View>
						<Text className="font-sans text-muted-foreground text-xs">
							{entry.label} · {entry.changedBy}
						</Text>
					</View>
				))}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
