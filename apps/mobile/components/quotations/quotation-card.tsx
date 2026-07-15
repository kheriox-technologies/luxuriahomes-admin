import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useAction, useMutation } from 'convex/react';
import {
	Ban,
	Check,
	EllipsisVertical,
	ExternalLink,
	MessageSquareText,
	Pencil,
	StickyNote,
	Trash2,
} from 'lucide-react-native';
import { memo, type RefObject, useRef } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { QuotationStatusPill } from '@/components/ui/status-pill';
import { formatCurrency } from '@/lib/format';
import { shareRemotePdf } from '@/lib/share-file';
import type { QuotationFormSheetHandle } from './quotation-form-sheet';
import type { QuotationNotesSheetHandle } from './quotation-notes-sheet';
import type { ProjectQuotation } from './types';

const FILENAME_INVALID = /[^\w.-]+/g;

function pdfFilename(title: string): string {
	const base = title.trim().replace(FILENAME_INVALID, '-').replace(/-+/g, '-');
	return `${base || 'quotation'}.pdf`;
}

export const QuotationCard = memo(function QuotationCard({
	quotation,
	notesSheetRef,
	formSheetRef,
}: {
	quotation: ProjectQuotation;
	notesSheetRef: RefObject<QuotationNotesSheetHandle | null>;
	formSheetRef: RefObject<QuotationFormSheetHandle | null>;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);

	const approve = useMutation(api.projectQuotations.approve.approve);
	const reject = useMutation(api.projectQuotations.reject.reject);
	const remove = useMutation(api.projectQuotations.remove.remove);
	const signUrl = useAction(api.cdn.signUrl.signUrl);

	const handleApprove = () => {
		approve({ quotationId: quotation._id }).catch(() =>
			Alert.alert('Unable to approve', 'Please try again.')
		);
	};

	const handleReject = () => {
		reject({ quotationId: quotation._id }).catch(() =>
			Alert.alert('Unable to reject', 'Please try again.')
		);
	};

	const handleViewDoc = async () => {
		if (!quotation.s3Key) {
			return;
		}
		try {
			const url = await signUrl({ s3Key: quotation.s3Key });
			await shareRemotePdf(url, pdfFilename(quotation.title));
		} catch {
			Alert.alert('Unable to open quotation', 'Please try again.');
		}
	};

	const confirmDelete = () => {
		Alert.alert(
			'Delete quotation?',
			'This will permanently delete this quotation. This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						remove({ quotationId: quotation._id }).catch(() =>
							Alert.alert('Unable to delete', 'Please try again.')
						);
					},
				},
			]
		);
	};

	const items: ActionSheetItem[] = [
		{
			key: 'edit',
			label: 'Edit',
			icon: Pencil,
			onPress: () => {
				sheetRef.current?.dismiss();
				formSheetRef.current?.present(quotation);
			},
		},
	];
	if (quotation.status !== 'Approved') {
		items.push({
			key: 'approve',
			label: 'Approve',
			icon: Check,
			onPress: () => {
				sheetRef.current?.dismiss();
				handleApprove();
			},
		});
	}
	if (quotation.status !== 'Rejected') {
		items.push({
			key: 'reject',
			label: 'Reject',
			icon: Ban,
			onPress: () => {
				sheetRef.current?.dismiss();
				handleReject();
			},
		});
	}
	if (quotation.s3Key) {
		items.push({
			key: 'view',
			label: 'View quotation',
			icon: ExternalLink,
			onPress: () => {
				sheetRef.current?.dismiss();
				handleViewDoc();
			},
		});
	}
	items.push({
		key: 'notes',
		label: 'View / edit notes',
		icon: StickyNote,
		onPress: () => {
			sheetRef.current?.dismiss();
			notesSheetRef.current?.present(quotation);
		},
	});
	items.push({
		key: 'delete',
		label: 'Delete',
		icon: Trash2,
		destructive: true,
		onPress: () => {
			sheetRef.current?.dismiss();
			confirmDelete();
		},
	});

	return (
		<Card className="mx-4 mb-2 gap-1.5 p-3.5">
			<View className="flex-row items-center gap-2">
				<Text className="flex-1 font-sans-semibold text-foreground text-sm">
					{quotation.title}
				</Text>
				<Pressable
					accessibilityLabel="Quotation actions"
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
			<Text className="font-sans text-muted-foreground text-xs">
				{quotation.companyName}
			</Text>
			<View className="flex-row flex-wrap items-center gap-1.5">
				<Badge variant="purple">{formatCurrency(quotation.price)}</Badge>
				<QuotationStatusPill status={quotation.status} />
				{quotation.noteCount > 0 ? (
					<View className="flex-row items-center gap-1">
						<MessageSquareText
							color={colors.mutedForeground}
							size={15}
							strokeWidth={2}
						/>
						<Text className="font-sans text-muted-foreground text-xs">
							{quotation.noteCount}
						</Text>
					</View>
				) : null}
			</View>
			<ActionSheet items={items} ref={sheetRef} title={quotation.title} />
		</Card>
	);
});
