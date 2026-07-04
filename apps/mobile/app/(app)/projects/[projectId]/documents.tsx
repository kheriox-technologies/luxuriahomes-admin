import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { getDocumentAsync } from 'expo-document-picker';
import {
	launchImageLibraryAsync,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import {
	ChevronRight,
	File,
	FileImage,
	FileText,
	FileUp,
	Folder,
	FolderOpen,
	FolderPlus,
	Home,
	ImagePlus,
	Upload,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { DocumentCardMenu } from '@/components/documents/document-card-menu';
import {
	InputSheet,
	type InputSheetHandle,
} from '@/components/documents/input-sheet';
import {
	MoveDocumentSheet,
	type MoveDocumentSheetHandle,
} from '@/components/documents/move-document-sheet';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';

type ProjectDocument = Doc<'projectDocuments'>;
type ProjectFolder = Doc<'projectDocumentFolders'>;

const KILOBYTE = 1024;

function formatSize(bytes: number | undefined): string {
	if (!bytes) {
		return '';
	}
	if (bytes < KILOBYTE * KILOBYTE) {
		return `${Math.round(bytes / KILOBYTE)} KB`;
	}
	return `${(bytes / (KILOBYTE * KILOBYTE)).toFixed(1)} MB`;
}

function fileIcon(mimeType: string | undefined) {
	if (mimeType?.startsWith('image/')) {
		return FileImage;
	}
	if (mimeType === 'application/pdf') {
		return FileText;
	}
	return File;
}

export default function DocumentsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const [folderPath, setFolderPath] = useState('');
	const [openingId, setOpeningId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const colors = useThemeColors();

	const inputSheetRef = useRef<InputSheetHandle>(null);
	const moveSheetRef = useRef<MoveDocumentSheetHandle>(null);
	const uploadSheetRef = useRef<BottomSheetModal>(null);

	const contents = useQuery(api.projectDocuments.listContents.listContents, {
		projectId: projectId as Id<'projects'>,
		folderPath,
	});
	const signUrl = useAction(api.cdn.signUrl.signUrl);
	const createFolder = useMutation(
		api.projectDocuments.createFolder.createFolder
	);
	const generateUploadUrl = useAction(
		api.projectDocuments.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.projectDocuments.create.create);

	const openDocument = async (document: ProjectDocument) => {
		setOpeningId(document._id);
		try {
			const url = await signUrl({ s3Key: document.s3Key });
			await openBrowserAsync(url);
		} catch {
			Alert.alert(
				'Unable to open document',
				'Check that CDN signing is configured on the Convex deployment.'
			);
		} finally {
			setOpeningId(null);
		}
	};

	const promptNewFolder = () => {
		inputSheetRef.current?.present({
			title: 'New folder',
			placeholder: 'Folder name',
			confirmLabel: 'Create',
			onConfirm: (name) =>
				createFolder({
					projectId: projectId as Id<'projects'>,
					name,
					parentPath: folderPath,
				}),
		});
	};

	const uploadOne = async (asset: {
		mimeType: string;
		name: string;
		size?: number;
		uri: string;
	}) => {
		const { uploadUrl, s3Key, kebabName } = await generateUploadUrl({
			projectId: projectId as Id<'projects'>,
			folderPath,
			fileName: asset.name,
			contentType: asset.mimeType,
		});
		const blob = await (await fetch(asset.uri)).blob();
		const response = await fetch(uploadUrl, {
			method: 'PUT',
			body: blob,
			headers: { 'Content-Type': asset.mimeType },
		});
		if (!response.ok) {
			throw new Error('Upload failed');
		}
		await createDocument({
			projectId: projectId as Id<'projects'>,
			name: asset.name,
			kebabName,
			s3Key,
			folderPath,
			size: asset.size,
			mimeType: asset.mimeType,
		});
	};

	const uploadPhoto = async () => {
		const permission = await requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert(
				'Permission needed',
				'Allow photo library access to upload photos.'
			);
			return;
		}
		const result = await launchImageLibraryAsync({
			mediaTypes: ['images'],
			quality: 0.8,
		});
		if (result.canceled) {
			return;
		}
		const asset = result.assets[0];
		if (!asset) {
			return;
		}
		setUploading(true);
		try {
			await uploadOne({
				uri: asset.uri,
				name: asset.fileName ?? `photo-${Date.now()}.jpg`,
				mimeType: asset.mimeType ?? 'image/jpeg',
				size: asset.fileSize,
			});
		} catch {
			Alert.alert('Unable to upload', 'Please try again.');
		} finally {
			setUploading(false);
		}
	};

	const uploadFiles = async () => {
		const result = await getDocumentAsync({
			type: '*/*',
			copyToCacheDirectory: true,
			multiple: true,
		});
		if (result.canceled) {
			return;
		}
		setUploading(true);
		try {
			for (const asset of result.assets) {
				await uploadOne({
					uri: asset.uri,
					name: asset.name,
					mimeType: asset.mimeType ?? 'application/octet-stream',
					size: asset.size,
				});
			}
		} catch {
			Alert.alert('Unable to upload', 'Please try again.');
		} finally {
			setUploading(false);
		}
	};

	if (contents === undefined) {
		return <ListSkeleton />;
	}

	const { folders, documents } = contents as {
		folders: ProjectFolder[];
		documents: ProjectDocument[];
	};
	const isEmpty = folders.length === 0 && documents.length === 0;
	const crumbs = folderPath ? folderPath.split('/') : [];

	return (
		<View className="flex-1">
			<View className="flex-row items-center gap-1 px-4 pb-2">
				<ScrollView
					className="max-h-[40px] flex-1"
					contentContainerClassName="items-center gap-1"
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<Pressable
						accessibilityLabel="Go to root folder"
						accessibilityRole="button"
						className="h-8 w-8 items-center justify-center rounded-full active:bg-muted"
						hitSlop={4}
						onPress={() => setFolderPath('')}
					>
						<Home
							color={folderPath ? colors.mutedForeground : colors.foreground}
							size={16}
							strokeWidth={2}
						/>
					</Pressable>
					{crumbs.map((crumb, index) => {
						const path = crumbs.slice(0, index + 1).join('/');
						const isLast = index === crumbs.length - 1;
						return (
							<View className="flex-row items-center gap-1" key={path}>
								<ChevronRight
									color={colors.mutedForeground}
									size={14}
									strokeWidth={2}
								/>
								<Pressable
									accessibilityLabel={`Go to folder ${crumb}`}
									accessibilityRole="button"
									className="min-h-[32px] justify-center rounded-md px-1.5 active:bg-muted"
									disabled={isLast}
									onPress={() => setFolderPath(path)}
								>
									<Text
										className={
											isLast
												? 'font-sans-semibold text-foreground text-sm'
												: 'font-sans text-muted-foreground text-sm'
										}
									>
										{crumb}
									</Text>
								</Pressable>
							</View>
						);
					})}
				</ScrollView>
				<Pressable
					accessibilityLabel="New folder"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-full active:bg-muted"
					hitSlop={4}
					onPress={promptNewFolder}
				>
					<FolderPlus color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<Pressable
					accessibilityLabel="Upload"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-full active:bg-muted"
					disabled={uploading}
					hitSlop={4}
					onPress={() => uploadSheetRef.current?.present()}
				>
					{uploading ? (
						<ActivityIndicator color={colors.mutedForeground} size="small" />
					) : (
						<Upload color={colors.foreground} size={20} strokeWidth={2} />
					)}
				</Pressable>
			</View>

			<ScrollView className="flex-1" contentContainerClassName="pb-6">
				{isEmpty ? (
					<EmptyState
						description="Files uploaded in the web portal will appear here."
						icon={FolderOpen}
						title="Empty folder"
					/>
				) : null}

				{folders.map((folder) => (
					<PressableCard
						accessibilityLabel={`Open folder ${folder.name}`}
						className="mx-4 mb-2 flex-row items-center gap-3 p-3.5"
						key={folder._id}
						onPress={() => setFolderPath(folder.path)}
					>
						<Folder
							color={colors.mutedForeground}
							size={20}
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

				{documents.map((document) => {
					const Icon = fileIcon(document.mimeType);
					const isOpening = openingId === document._id;
					return (
						<PressableCard
							accessibilityLabel={`Open document ${document.name}`}
							className="mx-4 mb-2 flex-row items-center gap-3 p-3.5"
							disabled={isOpening}
							key={document._id}
							onPress={() => openDocument(document)}
						>
							<Icon
								color={colors.mutedForeground}
								size={20}
								strokeWidth={1.75}
							/>
							<View className="flex-1 gap-1">
								<Text
									className="font-sans-medium text-foreground text-sm"
									numberOfLines={1}
								>
									{document.name}
								</Text>
								<Text className="font-sans text-muted-foreground text-xs">
									{formatDate(document.uploadedAt)}
									{document.size ? ` · ${formatSize(document.size)}` : ''}
								</Text>
								{document.clientPortalVisible || document.uploadedByClient ? (
									<View className="flex-row flex-wrap items-center gap-1 pt-0.5">
										{document.clientPortalVisible ? (
											<Badge variant="success">On client portal</Badge>
										) : null}
										{document.uploadedByClient ? (
											<Badge variant="default">Uploaded by client</Badge>
										) : null}
									</View>
								) : null}
							</View>
							{isOpening ? (
								<ActivityIndicator
									color={colors.mutedForeground}
									size="small"
								/>
							) : (
								<DocumentCardMenu
									document={document}
									inputSheetRef={inputSheetRef}
									moveSheetRef={moveSheetRef}
								/>
							)}
						</PressableCard>
					);
				})}
			</ScrollView>
			<InputSheet ref={inputSheetRef} />
			<MoveDocumentSheet ref={moveSheetRef} />
			<ActionSheet
				items={[
					{
						key: 'files',
						label: 'Files',
						icon: FileUp,
						onPress: () => {
							uploadSheetRef.current?.dismiss();
							uploadFiles();
						},
					},
					{
						key: 'photos',
						label: 'Photo library',
						icon: ImagePlus,
						onPress: () => {
							uploadSheetRef.current?.dismiss();
							uploadPhoto();
						},
					},
				]}
				ref={uploadSheetRef}
				title="Upload"
			/>
		</View>
	);
}
