import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useMutation } from 'convex/react';
import {
	CheckCircle2,
	CircleDashed,
	EllipsisVertical,
	ExternalLink,
	MapPin,
	MessageSquareText,
	ShoppingCart,
	SlidersHorizontal,
	Trash2,
} from 'lucide-react-native';
import { useRef } from 'react';
import { Alert, Pressable } from 'react-native';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { useInclusionActions } from './inclusion-actions-provider';
import type { ProjectInclusion } from './types';

export function InclusionCardMenu({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);
	const {
		addToOrder,
		deleteInclusion,
		openAdjustVariation,
		openEditQuantities,
		openNotes,
		pendingOrderItems,
		viewOrder,
	} = useInclusionActions();
	const update = useMutation(api.projectInclusions.update.update);

	const isApproved = inclusion.status === 'Approved';

	const activeVendor = pendingOrderItems[0]?.vendor;
	const isAlreadyInOrder = pendingOrderItems.some(
		(item) => item.inclusionId === inclusion._id
	);
	const canAddToOrder =
		isApproved &&
		!isAlreadyInOrder &&
		(!activeVendor || activeVendor === inclusion.vendor);

	const toggleApprove = () => {
		update({
			projectInclusionId: inclusion._id,
			status: isApproved ? 'Under Review' : 'Approved',
		}).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

	const runAndDismiss = (action: () => void) => {
		sheetRef.current?.dismiss();
		action();
	};

	const items: ActionSheetItem[] = [
		{
			key: 'approve',
			label: isApproved ? 'Mark under review' : 'Approve inclusion',
			icon: isApproved ? CircleDashed : CheckCircle2,
			onPress: () => runAndDismiss(toggleApprove),
		},
		{
			key: 'notes',
			label: 'View / edit notes',
			icon: MessageSquareText,
			onPress: () => runAndDismiss(() => openNotes(inclusion)),
		},
		{
			key: 'quantities',
			label: 'Edit quantities',
			icon: MapPin,
			onPress: () => runAndDismiss(() => openEditQuantities(inclusion)),
		},
		{
			key: 'variation',
			label: 'Adjust variation',
			icon: SlidersHorizontal,
			disabled: inclusion.class === 'Standard',
			onPress: () => runAndDismiss(() => openAdjustVariation(inclusion)),
		},
		{
			key: 'add-to-order',
			label: 'Add to order',
			icon: ShoppingCart,
			disabled: !canAddToOrder,
			onPress: () => runAndDismiss(() => addToOrder(inclusion)),
		},
	];

	if (inclusion.orderRefId) {
		const orderRefId = inclusion.orderRefId;
		items.push({
			key: 'view-order',
			label: 'View order',
			icon: ExternalLink,
			onPress: () => runAndDismiss(() => viewOrder(orderRefId, inclusion._id)),
		});
	}

	items.push({
		key: 'delete',
		label: 'Delete inclusion',
		icon: Trash2,
		destructive: true,
		onPress: () => runAndDismiss(() => deleteInclusion(inclusion)),
	});

	return (
		<>
			<Pressable
				accessibilityLabel="Inclusion actions"
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
			<ActionSheet items={items} ref={sheetRef} title={inclusion.title} />
		</>
	);
}
