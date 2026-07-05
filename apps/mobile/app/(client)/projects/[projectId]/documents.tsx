import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { getDocumentAsync } from 'expo-document-picker';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import {
	launchImageLibraryAsync,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import {
	File,
	FileImage,
	FileText,
	FileUp,
	FolderOpen,
	ImagePlus,
	Share2,
	Upload,
} from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { PressableCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import { toJpegUri } from '@/lib/image';
import { shareDocument } from '@/lib/share-file';

const fileExtension = /\.[^.]+$/;

type ProjectDocument = Doc<'projectDocuments'>;

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

export default function ClientDocumentsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const projectIdTyped = projectId as Id<'projects'>;
	const [openingId, setOpeningId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const colors = useThemeColors();

	const uploadSheetRef = useRef<BottomSheetModal>(null);

	const documents = useQuery(api.clientPortal.documents.list.list, {
		projectId: projectIdTyped,
	});
	const signUrl = useAction(api.clientPortal.cdn.signUrl.signUrl);
	const generateUploadUrl = useAction(
		api.clientPortal.documents.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.clientPortal.documents.create.create);

	const openDocument = async (document: ProjectDocument) => {
		setOpeningId(document._id);
		try {
			const url = await signUrl({
				projectId: projectIdTyped,
				s3Key: document.s3Key,
			});
			await openBrowserAsync(url);
		} catch {
			Alert.alert('Unable to open document', 'Please try again.');
		} finally {
			setOpeningId(null);
		}
	};

	const shareOne = useCallback(
		(document: ProjectDocument) =>
			shareDocument(
				({ s3Key }) => signUrl({ projectId: projectIdTyped, s3Key }),
				{
					kebabName: document.kebabName,
					mimeType: document.mimeType,
					name: document.name,
					s3Key: document.s3Key,
				}
			),
		[projectIdTyped, signUrl]
	);

	const uploadOne = async (asset: {
		mimeType: string;
		name: string;
		size?: number;
		uri: string;
	}) => {
		const { uploadUrl, s3Key, kebabName } = await generateUploadUrl({
			projectId: projectIdTyped,
			fileName: asset.name,
			contentType: asset.mimeType,
		});
		const response = await uploadAsync(uploadUrl, asset.uri, {
			httpMethod: 'PUT',
			uploadType: FileSystemUploadType.BINARY_CONTENT,
			headers: { 'Content-Type': asset.mimeType },
		});
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`Upload failed (${response.status})`);
		}
		await createDocument({
			projectId: projectIdTyped,
			name: asset.name,
			kebabName,
			s3Key,
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
			// Convert to JPEG so the image renders on the web portal (iOS returns HEIC).
			const jpegUri = await toJpegUri(asset.uri);
			const baseName =
				asset.fileName?.replace(fileExtension, '') ?? `photo-${Date.now()}`;
			await uploadOne({
				uri: jpegUri,
				name: `${baseName}.jpg`,
				mimeType: 'image/jpeg',
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

	if (documents === undefined) {
		return <ListSkeleton />;
	}

	return (
		<View className="flex-1">
			<View className="flex-row items-center justify-between px-4 pb-2">
				<Text className="font-sans text-muted-foreground text-sm">
					{documents.length} {documents.length === 1 ? 'document' : 'documents'}
				</Text>
				<Pressable
					accessibilityLabel="Upload"
					accessibilityRole="button"
					className="h-9 flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 active:bg-muted"
					disabled={uploading}
					hitSlop={4}
					onPress={() => uploadSheetRef.current?.present()}
				>
					{uploading ? (
						<ActivityIndicator color={colors.mutedForeground} size="small" />
					) : (
						<Upload color={colors.foreground} size={18} strokeWidth={2} />
					)}
					<Text className="font-sans-medium text-foreground text-sm">
						Upload
					</Text>
				</Pressable>
			</View>

			<ScrollView className="flex-1" contentContainerClassName="pb-6">
				{documents.length === 0 ? (
					<EmptyState
						description="Documents shared with you will appear here. You can also upload your own."
						icon={FolderOpen}
						title="No documents"
					/>
				) : null}

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
								{document.uploadedByClient ? (
									<View className="flex-row flex-wrap items-center gap-1 pt-0.5">
										<Badge variant="default">Your upload</Badge>
									</View>
								) : null}
							</View>
							{isOpening ? (
								<ActivityIndicator
									color={colors.mutedForeground}
									size="small"
								/>
							) : (
								<Pressable
									accessibilityLabel={`Share ${document.name}`}
									accessibilityRole="button"
									className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
									hitSlop={6}
									onPress={() => shareOne(document)}
								>
									<Share2
										color={colors.mutedForeground}
										size={18}
										strokeWidth={2}
									/>
								</Pressable>
							)}
						</PressableCard>
					);
				})}
			</ScrollView>

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
