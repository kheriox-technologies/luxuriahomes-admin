import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
	ArrowLeft,
	ClipboardList,
	EllipsisVertical,
	Mail,
	Pencil,
	Share2,
	Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AddToTaskSheetHandle } from '@/components/orders/add-to-task-sheet';
import { AddToTaskSheet } from '@/components/orders/add-to-task-sheet';
import type { OrderEmailSheetHandle } from '@/components/orders/order-email-sheet';
import { OrderEmailSheet } from '@/components/orders/order-email-sheet';
import type { OrderFormSheetHandle } from '@/components/orders/order-form-sheet';
import { OrderFormSheet } from '@/components/orders/order-form-sheet';
import { OrderNotesSection } from '@/components/orders/order-notes-section';
import { OrderStatusHistorySection } from '@/components/orders/order-status-history-section';
import { ORDER_STATUSES, type OrderStatus } from '@/components/orders/types';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { ListSkeleton } from '@/components/ui/skeleton';
import { shareRemotePdf } from '@/lib/share-file';

type Order = Doc<'projectOrders'>;

const STATUS_OPTIONS = ORDER_STATUSES.map((value) => ({ value, label: value }));

export default function OrderDetailsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { orderId } = useLocalSearchParams<{ orderId: Id<'projectOrders'> }>();

	const order = useQuery(api.projectOrders.get.get, { orderId }) as
		| Order
		| undefined;
	const update = useMutation(api.projectOrders.update.update);
	const removeOrder = useMutation(api.projectOrders.remove.remove);
	const generatePdf = useAction(api.projectOrders.generatePdf.generatePdf);

	const menuRef = useRef<BottomSheetModal>(null);
	const formSheetRef = useRef<OrderFormSheetHandle>(null);
	const addToTaskRef = useRef<AddToTaskSheetHandle>(null);
	const emailRef = useRef<OrderEmailSheetHandle>(null);

	const [preparing, setPreparing] = useState(false);

	const changeStatus = (status: OrderStatus) => {
		if (!order || order.status === status) {
			return;
		}
		// update() requires the full order payload; resend the existing values
		// unchanged with only the new status.
		update({
			orderId: order._id,
			vendor: order.vendor,
			orderBy: order.orderBy,
			items: order.items,
			status,
		}).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

	const handleShare = async () => {
		if (!order) {
			return;
		}
		setPreparing(true);
		try {
			const { url } = await generatePdf({ orderId: order._id });
			await shareRemotePdf(url, `${order.orderId}.pdf`);
		} catch {
			Alert.alert('Unable to generate PDF', 'Please try again.');
		} finally {
			setPreparing(false);
		}
	};

	const handleEmail = async () => {
		if (!order) {
			return;
		}
		setPreparing(true);
		try {
			const { s3Key } = await generatePdf({ orderId: order._id });
			emailRef.current?.present({
				filename: `${order.orderId}.pdf`,
				s3Key,
				subject: `Purchase Order ${order.orderId}`,
			});
		} catch {
			Alert.alert('Unable to prepare email', 'Please try again.');
		} finally {
			setPreparing(false);
		}
	};

	const confirmDelete = () => {
		if (!order) {
			return;
		}
		Alert.alert(
			'Delete order',
			`Delete order ${order.orderId} from ${order.vendor}? This also removes its notes and status history.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeOrder({ orderId: order._id })
							.then(() => router.back())
							.catch(() => {
								Alert.alert('Unable to delete', 'Please try again.');
							});
					},
				},
			]
		);
	};

	const openMenu = () => menuRef.current?.present();

	const menuItems = order
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: Pencil,
					onPress: () => {
						menuRef.current?.dismiss();
						formSheetRef.current?.present(order);
					},
				},
				{
					key: 'add-to-task',
					label: 'Add to task',
					icon: ClipboardList,
					onPress: () => {
						menuRef.current?.dismiss();
						addToTaskRef.current?.present(order);
					},
				},
				{
					key: 'share',
					label: 'Share',
					icon: Share2,
					disabled: preparing,
					onPress: () => {
						menuRef.current?.dismiss();
						handleShare();
					},
				},
				{
					key: 'email',
					label: 'Email',
					icon: Mail,
					disabled: preparing,
					onPress: () => {
						menuRef.current?.dismiss();
						handleEmail();
					},
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: () => {
						menuRef.current?.dismiss();
						confirmDelete();
					},
				},
			]
		: [];

	return (
		<View className="flex-1 bg-background">
			<View
				className="flex-row items-center gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<Pressable
					accessibilityLabel="Back"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
					hitSlop={4}
					onPress={() => router.back()}
				>
					<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<View className="flex-1">
					<Text
						className="font-sans-bold text-2xl text-foreground"
						numberOfLines={1}
					>
						{order?.orderId ?? 'Order'}
					</Text>
					{order ? (
						<Text
							className="font-sans text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{order.vendor}
						</Text>
					) : null}
				</View>
			</View>

			{order === undefined ? (
				<ListSkeleton />
			) : (
				<ScrollView
					contentContainerClassName="gap-4 px-4 pb-6"
					contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
				>
					<View className="flex-row items-center gap-2">
						<Select<OrderStatus>
							className="flex-1"
							onChange={changeStatus}
							options={STATUS_OPTIONS}
							title="Update status"
							value={order.status as OrderStatus}
						/>
						<Pressable
							accessibilityLabel="Order actions"
							accessibilityRole="button"
							className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
							hitSlop={4}
							onPress={openMenu}
						>
							<EllipsisVertical
								color={colors.foreground}
								size={18}
								strokeWidth={2}
							/>
						</Pressable>
					</View>

					<Card className="gap-2.5 p-3.5">
						<Text className="font-sans-semibold text-base text-foreground">
							Items
						</Text>
						{order.items.map((item, index) => (
							<View
								className="flex-row items-center justify-between gap-3"
								key={`${item.name}-${index}`}
							>
								<Text className="flex-1 font-sans text-foreground text-sm">
									{item.name}
								</Text>
								<Text className="font-sans-medium text-muted-foreground text-sm">
									{item.quantity} {item.unit}
								</Text>
							</View>
						))}
					</Card>

					<Card className="p-3.5">
						<OrderNotesSection order={order} />
					</Card>

					<Card className="p-3.5">
						<OrderStatusHistorySection order={order} />
					</Card>
				</ScrollView>
			)}

			{order ? (
				<>
					<ActionSheet items={menuItems} ref={menuRef} title="Order actions" />
					<OrderFormSheet projectId={order.projectId} ref={formSheetRef} />
					<AddToTaskSheet ref={addToTaskRef} />
					<OrderEmailSheet projectId={order.projectId} ref={emailRef} />
				</>
			) : null}

			<Modal animationType="fade" transparent visible={preparing}>
				<View className="flex-1 items-center justify-center bg-black/50">
					<View className="items-center gap-3 rounded-2xl bg-card px-6 py-5">
						<ActivityIndicator color={colors.foreground} size="large" />
						<Text className="font-sans-medium text-foreground text-sm">
							Generating PDF…
						</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
}
