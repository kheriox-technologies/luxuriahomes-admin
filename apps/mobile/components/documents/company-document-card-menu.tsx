import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import {
	EllipsisVertical,
	FolderInput,
	Pencil,
	Share2,
} from 'lucide-react-native';
import { type RefObject, useRef } from 'react';
import { Pressable } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { shareDocument } from '@/lib/share-file';
import type { InputSheetHandle } from './input-sheet';
import type { MoveCompanyDocumentSheetHandle } from './move-company-document-sheet';

type CompanyDocument = Doc<'companyDocuments'>;

export function CompanyDocumentCardMenu({
	document,
	inputSheetRef,
	moveSheetRef,
}: {
	document: CompanyDocument;
	inputSheetRef: RefObject<InputSheetHandle | null>;
	moveSheetRef: RefObject<MoveCompanyDocumentSheetHandle | null>;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);

	const signUrl = useAction(api.cdn.signUrl.signUrl);
	const rename = useAction(api.companyDocuments.rename.rename);

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
				]}
				ref={sheetRef}
				title={document.name}
			/>
		</>
	);
}
