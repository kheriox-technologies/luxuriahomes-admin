import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import {
	launchImageLibraryAsync,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { ImagePlus, Trash2, X } from 'lucide-react-native';
import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { formatDate } from '@/lib/format';
import { toJpegUri } from '@/lib/image';
import { useSignedUrl } from '@/lib/use-signed-url';
import type { ProjectQuotation } from './types';

type Note = Doc<'projectQuotationNotes'>;

interface PickedImage {
	mimeType: string;
	uri: string;
}

export interface QuotationNotesSheetHandle {
	present: (quotation: ProjectQuotation) => void;
}

function NoteImageThumb({
	s3Key,
	onPress,
}: {
	s3Key: string;
	onPress: (uri: string) => void;
}) {
	const { uri } = useSignedUrl(s3Key);
	return (
		<Pressable
			accessibilityLabel="View note image"
			accessibilityRole="imagebutton"
			className="h-16 w-16 overflow-hidden rounded-lg bg-muted"
			disabled={!uri}
			onPress={() => uri && onPress(uri)}
		>
			{uri ? (
				<Image
					cachePolicy="memory-disk"
					contentFit="cover"
					source={{ uri }}
					style={{ width: '100%', height: '100%' }}
				/>
			) : null}
		</Pressable>
	);
}

export function QuotationNotesSheet({
	ref,
}: {
	ref?: Ref<QuotationNotesSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [quotation, setQuotation] = useState<ProjectQuotation | null>(null);
	const [draft, setDraft] = useState('');
	const [pending, setPending] = useState<PickedImage[]>([]);
	const [saving, setSaving] = useState(false);
	const [lightboxUri, setLightboxUri] = useState<string | null>(null);

	const appendNote = useMutation(api.projectQuotations.appendNote.appendNote);
	const deleteNote = useMutation(api.projectQuotations.deleteNote.deleteNote);
	const generateUploadUrl = useAction(
		api.projectInclusions.generateNoteImageUploadUrl.generateNoteImageUploadUrl
	);

	const notes = useQuery(
		api.projectQuotations.listNotes.listNotes,
		quotation ? { quotationId: quotation._id } : 'skip'
	) as Note[] | undefined;

	useImperativeHandle(ref, () => ({
		present: (next: ProjectQuotation) => {
			setQuotation(next);
			setDraft('');
			setPending([]);
			sheetRef.current?.present();
		},
	}));

	const renderBackdrop = (props: BottomSheetBackdropProps) => (
		<BottomSheetBackdrop
			{...props}
			appearsOnIndex={0}
			disappearsOnIndex={-1}
			opacity={0.5}
		/>
	);

	const pickImage = async () => {
		const permission = await requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert(
				'Permission needed',
				'Allow photo library access to attach images.'
			);
			return;
		}
		const result = await launchImageLibraryAsync({
			mediaTypes: ['images'],
			quality: 0.7,
		});
		if (result.canceled) {
			return;
		}
		const asset = result.assets[0];
		if (asset) {
			setPending((prev) => [
				...prev,
				{ uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' },
			]);
		}
	};

	const uploadImage = async (image: PickedImage): Promise<string> => {
		if (!quotation) {
			throw new Error('No quotation selected');
		}
		// Convert to JPEG so the image renders on the web portal (iOS returns HEIC).
		const jpegUri = await toJpegUri(image.uri);
		const contentType = 'image/jpeg';
		const { uploadUrl, s3Key } = await generateUploadUrl({
			projectId: quotation.projectId,
			contentType,
			ext: 'jpg',
		});
		const response = await uploadAsync(uploadUrl, jpegUri, {
			httpMethod: 'PUT',
			uploadType: FileSystemUploadType.BINARY_CONTENT,
			headers: { 'Content-Type': contentType },
		});
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`Image upload failed (${response.status})`);
		}
		return s3Key;
	};

	const handleSave = async () => {
		if (!quotation || draft.trim() === '') {
			return;
		}
		setSaving(true);
		try {
			const images = await Promise.all(pending.map(uploadImage));
			await appendNote({
				quotationId: quotation._id,
				note: draft.trim(),
				images: images.length > 0 ? images : undefined,
			});
			setDraft('');
			setPending([]);
		} catch {
			Alert.alert('Unable to save note', 'Please try again.');
		} finally {
			setSaving(false);
		}
	};

	const confirmDelete = (noteId: Note['_id']) => {
		Alert.alert('Delete note?', 'This cannot be undone.', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					deleteNote({ noteId }).catch(() => {
						Alert.alert('Unable to delete', 'Please try again.');
					});
				},
			},
		]);
	};

	return (
		<>
			<BottomSheetModal
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.card }}
				enableDynamicSizing
				handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
				maxDynamicContentSize={640}
				ref={sheetRef}
			>
				<BottomSheetScrollView
					className="px-4 pt-1"
					contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
				>
					<Text
						className="px-1 pb-3 font-sans-semibold text-base text-foreground"
						numberOfLines={1}
					>
						{quotation ? quotation.title : 'Notes'}
					</Text>

					<View className="gap-2">
						<TextInput
							className="min-h-[72px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
							multiline
							onChangeText={setDraft}
							placeholder="Add a note…"
							placeholderTextColor={colors.mutedForeground}
							style={{ textAlignVertical: 'top' }}
							value={draft}
						/>
						{pending.length > 0 ? (
							<View className="flex-row flex-wrap gap-2">
								{pending.map((image, index) => (
									<View
										className="h-16 w-16 overflow-hidden rounded-lg bg-muted"
										key={image.uri}
									>
										<Image
											contentFit="cover"
											source={{ uri: image.uri }}
											style={{ width: '100%', height: '100%' }}
										/>
										<Pressable
											accessibilityLabel="Remove image"
											accessibilityRole="button"
											className="absolute top-0.5 right-0.5 h-6 w-6 items-center justify-center rounded-full bg-black/60"
											hitSlop={4}
											onPress={() =>
												setPending((prev) => prev.filter((_, i) => i !== index))
											}
										>
											<X color="#ffffff" size={14} strokeWidth={2.5} />
										</Pressable>
									</View>
								))}
							</View>
						) : null}
						<View className="flex-row items-center gap-2">
							<Button
								className="flex-1"
								icon={
									<ImagePlus
										color={colors.foreground}
										size={18}
										strokeWidth={2}
									/>
								}
								onPress={pickImage}
								variant="secondary"
							>
								Attach photo
							</Button>
							<Button
								className="flex-1"
								disabled={draft.trim() === ''}
								loading={saving}
								onPress={handleSave}
								variant="primary"
							>
								Add note
							</Button>
						</View>
					</View>

					<View className="gap-2 pt-3">
						{notes === undefined ? (
							<ActivityIndicator color={colors.mutedForeground} size="small" />
						) : null}
						{notes?.length === 0 ? (
							<Text className="py-2 font-sans text-muted-foreground text-sm">
								No notes yet.
							</Text>
						) : null}
						{notes?.map((note) => (
							<View
								className="gap-2 rounded-xl border border-border bg-background p-3"
								key={note._id}
							>
								<View className="flex-row items-center justify-between gap-2">
									<Text className="flex-1 font-sans-medium text-foreground text-sm">
										{note.addedBy}
									</Text>
									<Text className="font-sans text-muted-foreground text-xs">
										{formatDate(note.timestamp)}
									</Text>
									<Pressable
										accessibilityLabel="Delete note"
										accessibilityRole="button"
										hitSlop={8}
										onPress={() => confirmDelete(note._id)}
									>
										<Trash2
											color={colors.destructive}
											size={16}
											strokeWidth={2}
										/>
									</Pressable>
								</View>
								<Text className="font-sans text-foreground text-sm">
									{note.note}
								</Text>
								{note.images && note.images.length > 0 ? (
									<View className="flex-row flex-wrap gap-2">
										{note.images.map((s3Key) => (
											<NoteImageThumb
												key={s3Key}
												onPress={setLightboxUri}
												s3Key={s3Key}
											/>
										))}
									</View>
								) : null}
							</View>
						))}
					</View>
				</BottomSheetScrollView>
			</BottomSheetModal>
			<ImageLightbox
				onClose={() => setLightboxUri(null)}
				uri={lightboxUri}
				visible={lightboxUri !== null}
			/>
		</>
	);
}
