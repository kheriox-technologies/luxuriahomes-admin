import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import {
	EllipsisVertical,
	FolderInput,
	MonitorSmartphone,
	MonitorX,
	Pencil,
	Share2,
} from 'lucide-react-native';
import { type RefObject, useRef } from 'react';
import { Alert, Pressable } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { shareDocument } from '@/lib/share-file';
import type { InputSheetHandle } from './input-sheet';
import type { MoveDocumentSheetHandle } from './move-document-sheet';

type ProjectDocument = Doc<'projectDocuments'>;

export function DocumentCardMenu({
	document,
	inputSheetRef,
	moveSheetRef,
}: {
	document: ProjectDocument;
	inputSheetRef: RefObject<InputSheetHandle | null>;
	moveSheetRef: RefObject<MoveDocumentSheetHandle | null>;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);

	const signUrl = useAction(api.cdn.signUrl.signUrl);
	const rename = useAction(api.projectDocuments.rename.rename);
	const setClientPortalVisibility = useMutation(
		api.projectDocuments.setClientPortalVisibility.setClientPortalVisibility
	);

	const onPortal = document.clientPortalVisible === true;

	const togglePortal = () => {
		setClientPortalVisibility({
			documentId: document._id,
			visible: !onPortal,
		}).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

	return (
		<>
			<Pressable
				accessibilityLabel="Document actions"
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
						key: 'share',
						label: 'Share',
						icon: Share2,
						onPress: () => {
							sheetRef.current?.dismiss();
							shareDocument(signUrl, document);
						},
					},
					{
						key: 'move',
						label: 'Move to folder',
						icon: FolderInput,
						onPress: () => {
							sheetRef.current?.dismiss();
							moveSheetRef.current?.present(document);
						},
					},
					{
						key: 'rename',
						label: 'Rename',
						icon: Pencil,
						onPress: () => {
							sheetRef.current?.dismiss();
							inputSheetRef.current?.present({
								title: 'Rename document',
								initialValue: document.name,
								confirmLabel: 'Rename',
								onConfirm: (newName) =>
									rename({ documentId: document._id, newName }),
							});
						},
					},
					{
						key: 'portal',
						label: onPortal
							? 'Remove from client portal'
							: 'Add to client portal',
						icon: onPortal ? MonitorX : MonitorSmartphone,
						onPress: () => {
							sheetRef.current?.dismiss();
							togglePortal();
						},
					},
				]}
				ref={sheetRef}
				title={document.name}
			/>
		</>
	);
}
