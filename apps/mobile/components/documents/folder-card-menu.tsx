import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import {
	EllipsisVertical,
	MonitorSmartphone,
	MonitorX,
	Pencil,
	Trash2,
} from 'lucide-react-native';
import { type RefObject, useRef } from 'react';
import { Alert, Pressable } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import type { InputSheetHandle } from './input-sheet';

type ProjectFolder = Doc<'projectDocumentFolders'>;

export function FolderCardMenu({
	folder,
	inputSheetRef,
}: {
	folder: ProjectFolder;
	inputSheetRef: RefObject<InputSheetHandle | null>;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);

	const renameFolder = useAction(
		api.projectDocuments.renameFolder.renameFolder
	);
	const deleteFolder = useAction(
		api.projectDocuments.deleteFolder.deleteFolder
	);
	const setFolderClientPortalVisibility = useMutation(
		api.projectDocuments.setFolderClientPortalVisibility
			.setFolderClientPortalVisibility
	);

	const setPortal = (visible: boolean) => {
		setFolderClientPortalVisibility({ folderId: folder._id, visible }).catch(
			() => {
				Alert.alert('Unable to update', 'Please try again.');
			}
		);
	};

	const confirmDelete = () => {
		Alert.alert(
			'Delete folder?',
			`Delete "${folder.name}" and all its contents? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						deleteFolder({ folderId: folder._id }).catch(() => {
							Alert.alert('Unable to delete', 'Please try again.');
						});
					},
				},
			]
		);
	};

	return (
		<>
			<Pressable
				accessibilityLabel="Folder actions"
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
						key: 'rename',
						label: 'Rename',
						icon: Pencil,
						onPress: () => {
							sheetRef.current?.dismiss();
							inputSheetRef.current?.present({
								title: 'Rename folder',
								initialValue: folder.name,
								confirmLabel: 'Rename',
								onConfirm: (newName) =>
									renameFolder({ folderId: folder._id, newName }),
							});
						},
					},
					{
						key: 'portal-add',
						label: 'Add all to client portal',
						icon: MonitorSmartphone,
						onPress: () => {
							sheetRef.current?.dismiss();
							setPortal(true);
						},
					},
					{
						key: 'portal-remove',
						label: 'Remove all from client portal',
						icon: MonitorX,
						onPress: () => {
							sheetRef.current?.dismiss();
							setPortal(false);
						},
					},
					{
						key: 'delete',
						label: 'Delete folder',
						icon: Trash2,
						destructive: true,
						onPress: () => {
							sheetRef.current?.dismiss();
							confirmDelete();
						},
					},
				]}
				ref={sheetRef}
				title={folder.name}
			/>
		</>
	);
}
