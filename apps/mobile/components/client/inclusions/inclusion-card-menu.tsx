import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useMutation } from 'convex/react';
import {
	CheckCircle2,
	CircleDashed,
	EllipsisVertical,
	MessageSquareText,
} from 'lucide-react-native';
import { useRef } from 'react';
import { Alert, Pressable } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { useClientInclusionActions } from './inclusion-actions-provider';
import type { ClientInclusion } from './types';

export function ClientInclusionCardMenu({
	inclusion,
}: {
	inclusion: ClientInclusion;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);
	const { openNotes } = useClientInclusionActions();
	const setStatus = useMutation(
		api.clientPortal.inclusions.setStatus.setStatus
	);

	const isApproved = inclusion.status === 'Approved';

	const toggleApprove = () => {
		setStatus({
			projectInclusionId: inclusion._id,
			status: isApproved ? 'Under Review' : 'Approved',
		}).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

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
			<ActionSheet
				items={[
					{
						key: 'approve',
						label: isApproved ? 'Mark under review' : 'Approve inclusion',
						icon: isApproved ? CircleDashed : CheckCircle2,
						onPress: () => {
							sheetRef.current?.dismiss();
							toggleApprove();
						},
					},
					{
						key: 'notes',
						label: 'View / edit notes',
						icon: MessageSquareText,
						onPress: () => {
							sheetRef.current?.dismiss();
							openNotes(inclusion);
						},
					},
				]}
				ref={sheetRef}
				title={inclusion.title}
			/>
		</>
	);
}
