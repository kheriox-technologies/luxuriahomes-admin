import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Check, X } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { cn } from '@/lib/cn';

type Order = Doc<'projectOrders'>;

export interface AddToTaskSheetHandle {
	present: (order: Order) => void;
}

/**
 * Link an order to an order task. Selecting a task calls `linkOrderTask`, which
 * derives the order's order-by / deliver-by dates from the task timeline on the
 * backend. Mirrors the portal Add-to-Task dialog.
 */
export function AddToTaskSheet({ ref }: { ref?: Ref<AddToTaskSheetHandle> }) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [order, setOrder] = useState<Order | null>(null);
	const [linkingId, setLinkingId] = useState<
		Id<'projectOrderTasks'> | 'none' | null
	>(null);

	const linkOrderTask = useMutation(
		api.projectOrders.linkOrderTask.linkOrderTask
	);
	const orderTasks = useQuery(
		api.projectOrderTasks.listByProject.listByProject,
		order ? { projectId: order.projectId } : 'skip'
	);
	const tasks = useQuery(
		api.projectTasks.listByProject.listByProject,
		order ? { projectId: order.projectId } : 'skip'
	);

	const taskNameById = useMemo(() => {
		const map = new Map<Id<'projectTasks'>, string>();
		for (const task of tasks ?? []) {
			map.set(task._id, task.name);
		}
		return map;
	}, [tasks]);

	const options = useMemo(
		() =>
			(orderTasks ?? []).map((orderTask) => {
				const parentName = taskNameById.get(orderTask.parentTaskId) ?? '';
				return {
					id: orderTask._id,
					label: parentName
						? `${parentName} · ${orderTask.name}`
						: orderTask.name,
				};
			}),
		[orderTasks, taskNameById]
	);

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

	const handleLink = async (
		orderTaskId: Id<'projectOrderTasks'> | null,
		busyKey: Id<'projectOrderTasks'> | 'none'
	) => {
		if (!order) {
			return;
		}
		setLinkingId(busyKey);
		try {
			await linkOrderTask({ orderId: order._id, orderTaskId });
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not link order', 'Please try again.');
		} finally {
			setLinkingId(null);
		}
	};

	const isLoading =
		order === null || orderTasks === undefined || tasks === undefined;
	const currentOrderTaskId = order?.orderTaskId ?? null;

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={640}
			onDismiss={() => setLinkingId(null)}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="px-1 pb-1 font-sans-semibold text-base text-foreground">
					Add to task
				</Text>
				<Text className="px-1 pb-3 font-sans text-muted-foreground text-xs">
					The order dates update from the task timeline.
				</Text>

				{currentOrderTaskId ? (
					<Pressable
						accessibilityRole="button"
						className="min-h-[48px] flex-row items-center gap-3 rounded-lg px-3 active:bg-muted"
						disabled={linkingId !== null}
						onPress={() => handleLink(null, 'none')}
					>
						<X color={colors.destructive} size={18} strokeWidth={2} />
						<Text className="flex-1 font-sans-medium text-destructive text-xs">
							Unlink from task
						</Text>
					</Pressable>
				) : null}

				{isLoading ? (
					<Text className="py-3 font-sans text-muted-foreground text-sm">
						Loading…
					</Text>
				) : null}
				{!isLoading && options.length === 0 ? (
					<Text className="py-3 font-sans text-muted-foreground text-sm">
						No order tasks found for this project.
					</Text>
				) : null}
				{options.map((option) => {
					const selected = option.id === currentOrderTaskId;
					return (
						<Pressable
							accessibilityLabel={option.label}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							className={cn(
								'min-h-[48px] flex-row items-center justify-between gap-3 rounded-lg px-3 active:bg-muted',
								selected && 'bg-muted'
							)}
							disabled={linkingId !== null}
							key={option.id}
							onPress={() => handleLink(option.id, option.id)}
						>
							<Text
								className="flex-1 font-sans-medium text-foreground text-xs"
								numberOfLines={2}
							>
								{option.label}
							</Text>
							{selected ? (
								<Check color={colors.foreground} size={18} strokeWidth={2} />
							) : null}
						</Pressable>
					);
				})}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
