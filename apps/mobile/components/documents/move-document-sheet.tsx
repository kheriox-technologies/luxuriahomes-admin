import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useAction, useQuery } from 'convex/react';
import { ChevronLeft, ChevronRight, Folder, Home } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { PressableCard } from '@/components/ui/card';

type ProjectDocument = Doc<'projectDocuments'>;
type ProjectFolder = Doc<'projectDocumentFolders'>;

export interface MoveDocumentSheetHandle {
	present: (document: ProjectDocument) => void;
}

export function MoveDocumentSheet({
	ref,
}: {
	ref?: Ref<MoveDocumentSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [document, setDocument] = useState<ProjectDocument | null>(null);
	const [targetPath, setTargetPath] = useState('');
	const [saving, setSaving] = useState(false);

	const move = useAction(api.projectDocuments.move.move);
	const contents = useQuery(
		api.projectDocuments.listContents.listContents,
		document
			? { projectId: document.projectId, folderPath: targetPath }
			: 'skip'
	) as { folders: ProjectFolder[]; documents: ProjectDocument[] } | undefined;

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setDocument(next);
			setTargetPath('');
			setSaving(false);
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

	const goUp = () => {
		const parts = targetPath.split('/');
		parts.pop();
		setTargetPath(parts.join('/'));
	};

	const handleMove = async () => {
		if (!document) {
			return;
		}
		setSaving(true);
		try {
			await move({ documentId: document._id, targetFolderPath: targetPath });
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Unable to move document', 'Please try again.');
		} finally {
			setSaving(false);
		}
	};

	const folders = contents?.folders ?? [];
	const isCurrentLocation = document?.folderPath === targetPath;

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={520}
			ref={sheetRef}
		>
			<BottomSheetView
				className="gap-3 px-4 pt-1"
				style={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text
					className="font-sans-semibold text-base text-foreground"
					numberOfLines={1}
				>
					Move{document ? ` · ${document.name}` : ''}
				</Text>

				<View className="flex-row items-center gap-2">
					<Pressable
						accessibilityLabel="Go to root folder"
						accessibilityRole="button"
						className="h-8 w-8 items-center justify-center rounded-full active:bg-muted"
						hitSlop={4}
						onPress={() => setTargetPath('')}
					>
						<Home
							color={targetPath ? colors.mutedForeground : colors.foreground}
							size={16}
							strokeWidth={2}
						/>
					</Pressable>
					{targetPath ? (
						<Pressable
							accessibilityLabel="Go up one folder"
							accessibilityRole="button"
							className="h-8 flex-row items-center gap-1 rounded-full px-2 active:bg-muted"
							hitSlop={4}
							onPress={goUp}
						>
							<ChevronLeft
								color={colors.mutedForeground}
								size={16}
								strokeWidth={2}
							/>
							<Text
								className="font-sans-medium text-foreground text-sm"
								numberOfLines={1}
							>
								{targetPath.split('/').pop()}
							</Text>
						</Pressable>
					) : (
						<Text className="font-sans-medium text-muted-foreground text-sm">
							Home
						</Text>
					)}
				</View>

				<ScrollView className="max-h-[280px]">
					{folders.length === 0 ? (
						<Text className="py-3 font-sans text-muted-foreground text-sm">
							No subfolders here.
						</Text>
					) : null}
					{folders.map((folder) => (
						<PressableCard
							accessibilityLabel={`Open folder ${folder.name}`}
							className="mb-2 flex-row items-center gap-3 p-3"
							key={folder._id}
							onPress={() => setTargetPath(folder.path)}
						>
							<Folder
								color={colors.mutedForeground}
								size={18}
								strokeWidth={1.75}
							/>
							<Text className="flex-1 font-sans-medium text-foreground text-sm">
								{folder.name}
							</Text>
							<ChevronRight
								color={colors.mutedForeground}
								size={16}
								strokeWidth={2}
							/>
						</PressableCard>
					))}
				</ScrollView>

				<Button
					disabled={isCurrentLocation}
					loading={saving}
					onPress={handleMove}
					variant="primary"
				>
					{isCurrentLocation ? 'Already here' : 'Move here'}
				</Button>
			</BottomSheetView>
		</BottomSheetModal>
	);
}
