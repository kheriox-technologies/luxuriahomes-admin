import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Check, ImagePlus, Plus, X } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialColorSelectField } from '@/components/inclusions/material-color-select-field';
import { VendorSelectField } from '@/components/orders/vendor-select-field';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { Select, type SelectOption } from '@/components/ui/select';
import { TextField } from '@/components/ui/text-field';
import { useSignedUrl } from '@/lib/use-signed-url';

type InclusionVariant = Doc<'inclusionVariants'>;
type VariantClass = InclusionVariant['class'];

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

const CLASS_OPTIONS: readonly SelectOption<VariantClass>[] = [
	{ value: 'Standard', label: 'Standard' },
	{ value: 'Gold', label: 'Gold' },
	{ value: 'Platinum', label: 'Platinum' },
];

export interface VariantFormSheetHandle {
	present: (inclusionId: Id<'inclusions'>, variant?: InclusionVariant) => void;
}

function parseOptionalMoney(raw: string): number | undefined {
	const trimmed = raw.trim();
	if (trimmed === '') {
		return undefined;
	}
	return Number(trimmed);
}

/**
 * Add / Edit inclusion variant bottom sheet. `present(inclusionId)` opens in
 * create mode, `present(inclusionId, variant)` opens in edit mode with fields
 * pre-filled. Mirrors the portal Add/Edit variant sheets (class + pricing,
 * vendor, models, colour, details, link, image). The variant code is generated
 * server-side, so it is never edited here.
 */
export function VariantFormSheet({
	ref,
}: {
	ref?: Ref<VariantFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addVariant = useMutation(api.inclusionVariants.add.add);
	const updateVariant = useMutation(api.inclusionVariants.update.update);
	const generateS3UploadUrl = useAction(
		api.fileStorage.generateS3UploadUrl.generateS3UploadUrl
	);

	const [inclusionId, setInclusionId] = useState<Id<'inclusions'> | null>(null);
	const [editingId, setEditingId] = useState<Id<'inclusionVariants'> | null>(
		null
	);
	const [variantClass, setVariantClass] = useState<VariantClass>('Standard');
	const [costPrice, setCostPrice] = useState('');
	const [salePrice, setSalePrice] = useState('');
	const [labourPrice, setLabourPrice] = useState('');
	const [vendor, setVendor] = useState('');
	const [models, setModels] = useState<string[]>([]);
	const [modelDraft, setModelDraft] = useState('');
	const [color, setColor] = useState('');
	const [details, setDetails] = useState('');
	const [link, setLink] = useState('');
	const [s3Key, setS3Key] = useState<string | undefined>(undefined);
	const [localPreviewUri, setLocalPreviewUri] = useState<string | undefined>(
		undefined
	);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	const { uri: signedUri } = useSignedUrl(localPreviewUri ? undefined : s3Key);
	const previewUri = localPreviewUri ?? signedUri;

	useImperativeHandle(ref, () => ({
		present: (nextInclusionId, variant) => {
			setInclusionId(nextInclusionId);
			setEditingId(variant?._id ?? null);
			setVariantClass(variant?.class ?? 'Standard');
			setCostPrice(variant ? String(variant.costPrice) : '');
			setSalePrice(variant ? String(variant.salePrice) : '');
			setLabourPrice(
				variant?.labourPrice === undefined ? '' : String(variant.labourPrice)
			);
			setVendor(variant?.vendor ?? '');
			setModels(variant?.models ?? []);
			setModelDraft('');
			setColor(variant?.color ?? '');
			setDetails(variant?.details ?? '');
			setLink(variant?.link ?? '');
			setS3Key(variant?.image);
			setLocalPreviewUri(undefined);
			setShowErrors(false);
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

	const priceInvalid = (raw: string) => !MONEY_PATTERN.test(raw.trim());
	const optionalPriceInvalid = (raw: string) =>
		raw.trim() !== '' && !MONEY_PATTERN.test(raw.trim());

	const addModel = () => {
		const normalized = modelDraft.trim();
		if (!normalized) {
			return;
		}
		if (!models.includes(normalized)) {
			setModels((prev) => [...prev, normalized]);
		}
		setModelDraft('');
	};

	const pickImage = async () => {
		const result = await launchImageLibraryAsync({
			mediaTypes: 'images',
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
		setLocalPreviewUri(asset.uri);
		try {
			const ext =
				asset.fileName?.split('.').pop() || asset.uri.split('.').pop() || 'jpg';
			const contentType = asset.mimeType || 'image/jpeg';
			const upload = await generateS3UploadUrl({ contentType, ext });
			const response = await uploadAsync(upload.uploadUrl, asset.uri, {
				httpMethod: 'PUT',
				uploadType: FileSystemUploadType.BINARY_CONTENT,
				headers: { 'Content-Type': contentType },
			});
			if (response.status < 200 || response.status >= 300) {
				throw new Error(`Upload failed (${response.status})`);
			}
			setS3Key(upload.s3Key);
		} catch {
			setLocalPreviewUri(undefined);
			Alert.alert('Upload failed', 'Please try again.');
		} finally {
			setUploading(false);
		}
	};

	const clearImage = () => {
		setS3Key(undefined);
		setLocalPreviewUri(undefined);
	};

	const handleSave = async () => {
		const trimmedVendor = vendor.trim();
		if (
			!inclusionId ||
			trimmedVendor === '' ||
			priceInvalid(costPrice) ||
			priceInvalid(salePrice) ||
			optionalPriceInvalid(labourPrice)
		) {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			const parsedLabour = parseOptionalMoney(labourPrice);
			const trimmedColor = color.trim();
			const trimmedDetails = details.trim();
			const trimmedLink = link.trim();
			if (editingId) {
				await updateVariant({
					variantId: editingId,
					class: variantClass,
					costPrice: Number(costPrice.trim()),
					salePrice: Number(salePrice.trim()),
					labourPrice: parsedLabour ?? null,
					vendor: trimmedVendor,
					models,
					color: trimmedColor === '' ? null : trimmedColor,
					details: trimmedDetails === '' ? null : trimmedDetails,
					link: trimmedLink === '' ? null : trimmedLink,
					image: s3Key ?? null,
				});
			} else {
				await addVariant({
					inclusionId,
					class: variantClass,
					costPrice: Number(costPrice.trim()),
					salePrice: Number(salePrice.trim()),
					labourPrice: parsedLabour,
					vendor: trimmedVendor,
					models,
					color: trimmedColor === '' ? undefined : trimmedColor,
					details: trimmedDetails === '' ? undefined : trimmedDetails,
					link: trimmedLink === '' ? undefined : trimmedLink,
					image: s3Key,
				});
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert(
				editingId ? 'Could not update variant' : 'Could not add variant',
				'Please try again.'
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={720}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{editingId ? 'Edit variant' : 'Add variant'}
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Class
					</Text>
					<Select
						onChange={setVariantClass}
						options={CLASS_OPTIONS}
						title="Select class"
						value={variantClass}
					/>
				</View>

				<TextField
					error={
						showErrors && priceInvalid(costPrice)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Cost price (AUD)"
					onChangeText={setCostPrice}
					placeholder="0.00"
					value={costPrice}
				/>

				<TextField
					error={
						showErrors && priceInvalid(salePrice)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Sale price (AUD)"
					onChangeText={setSalePrice}
					placeholder="0.00"
					value={salePrice}
				/>

				<TextField
					error={
						showErrors && optionalPriceInvalid(labourPrice)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Labour price (AUD, optional)"
					onChangeText={setLabourPrice}
					placeholder="0.00"
					value={labourPrice}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Vendor
					</Text>
					<VendorSelectField
						allowCreate
						invalid={showErrors && vendor.trim() === ''}
						onValueChange={setVendor}
						value={vendor}
					/>
					{showErrors && vendor.trim() === '' ? (
						<Text className="font-sans text-destructive text-xs">
							A vendor is required
						</Text>
					) : null}
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Models
					</Text>
					<View className="flex-row items-center gap-2">
						<BottomSheetTextInput
							className="h-9 flex-1 rounded-lg border border-border bg-card px-3 font-sans text-foreground text-sm"
							onChangeText={setModelDraft}
							onSubmitEditing={addModel}
							placeholder="Type a model, then add"
							placeholderTextColor={colors.mutedForeground}
							returnKeyType="done"
							value={modelDraft}
						/>
						<Pressable
							accessibilityLabel="Add model"
							accessibilityRole="button"
							className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
							hitSlop={4}
							onPress={addModel}
						>
							<Plus color={colors.foreground} size={18} strokeWidth={2} />
						</Pressable>
					</View>
					{models.length > 0 ? (
						<View className="flex-row flex-wrap gap-1.5">
							{models.map((model) => (
								<View
									className="flex-row items-center gap-1.5 rounded-sm border border-border px-2.5 py-1"
									key={model}
								>
									<Text className="font-sans-medium text-foreground text-xs">
										{model}
									</Text>
									<Pressable
										accessibilityLabel={`Remove ${model}`}
										accessibilityRole="button"
										hitSlop={8}
										onPress={() =>
											setModels((prev) => prev.filter((m) => m !== model))
										}
									>
										<X
											color={colors.mutedForeground}
											size={14}
											strokeWidth={2}
										/>
									</Pressable>
								</View>
							))}
						</View>
					) : null}
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Colour
					</Text>
					<MaterialColorSelectField
						allowCreate
						onValueChange={setColor}
						value={color}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Details
					</Text>
					<BottomSheetTextInput
						className="min-h-[80px] rounded-lg border border-border bg-card px-3 py-2.5 font-sans text-foreground text-sm"
						multiline
						onChangeText={setDetails}
						placeholder="Additional details"
						placeholderTextColor={colors.mutedForeground}
						style={{ textAlignVertical: 'top' }}
						value={details}
					/>
				</View>

				<TextField
					autoCapitalize="none"
					keyboardType="url"
					label="Link (optional)"
					onChangeText={setLink}
					placeholder="https://"
					value={link}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Image
					</Text>
					<View className="flex-row items-center gap-3">
						<Pressable
							accessibilityLabel={
								s3Key || previewUri ? 'Replace image' : 'Add image'
							}
							accessibilityRole="button"
							className="h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted active:opacity-80"
							disabled={uploading}
							onPress={pickImage}
						>
							{uploading ? (
								<ActivityIndicator
									color={colors.mutedForeground}
									size="small"
								/>
							) : null}
							{!uploading && previewUri ? (
								<Image
									cachePolicy="memory-disk"
									contentFit="cover"
									source={{ uri: previewUri }}
									style={{ width: '100%', height: '100%' }}
								/>
							) : null}
							{uploading || previewUri ? null : (
								<ImagePlus
									color={colors.mutedForeground}
									size={24}
									strokeWidth={1.75}
								/>
							)}
						</Pressable>
						<View className="flex-1 gap-1">
							<Text className="font-sans text-muted-foreground text-xs">
								{s3Key || previewUri
									? 'Tap the image to replace it.'
									: 'Tap to add an image.'}
							</Text>
							{s3Key || previewUri ? (
								<Button
									className="self-start"
									disabled={uploading}
									icon={
										<X color={colors.destructive} size={18} strokeWidth={2} />
									}
									onPress={clearImage}
									variant="destructive-outline"
								>
									Remove
								</Button>
							) : null}
						</View>
					</View>
				</View>

				<Button
					className="mt-1"
					disabled={uploading}
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					{editingId ? 'Save changes' : 'Save variant'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
